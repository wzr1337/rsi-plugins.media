import { BehaviorSubject } from "rxjs";

import {
  CollectionResponse,
  ElementResponse,
  IElement,
  IResourceUpdate,
  Resource,
  RsiLogger,
  Service,
} from "@rsi/core";

import { ICollectionObject, IRendererElement, IRendererObject } from "./media.types";
import { NetfluxRenderer } from "./renderers/netflux";

export class Renderers extends Resource {
  private renderers: Array<BehaviorSubject<IRendererElement>> = [];
  private nR: NetfluxRenderer;
  private logger = RsiLogger.getInstance().getLogger("media.Renderers");

  constructor(service: Service, private mediaCollection: ICollectionObject) {
    super(service);
    this.nR = new NetfluxRenderer(service, this, mediaCollection);
    this.renderers.push(this.nR);

    this._change = new BehaviorSubject({
      action: "init",
      lastUpdate: Date.now()
    } as IResourceUpdate);
  }

  get elementSubscribable(): boolean {
    return true;
  }

  get elements(): Array<BehaviorSubject<IElement>> {
    return this.renderers;
  }

  public async getElement(elementId: string): Promise<ElementResponse> {
    // find the element requested by the client
    const data = this.renderers.find((element: BehaviorSubject<IRendererElement>) => {
      if (element) {
        return (element.getValue().data as { id: string }).id === elementId;
      }
      return undefined;
    });
    return data ? { data, status: "ok" } : undefined;
  }

  public async getResource(
    offset?: string | number,
    limit?: string | number
  ): Promise<CollectionResponse> {
    // retriev all element
    let resp: Array<BehaviorSubject<IRendererElement>>;

    if (
      (typeof offset === "number" && typeof limit === "number") ||
      (typeof limit === "number" && !offset) ||
      (typeof offset === "number" && !limit) ||
      (!offset && !limit)
    ) {
      resp = this.renderers.slice(offset as number, limit as number);
    }

    return { status: "ok", data: resp };
  }

  public async updateElement(elementId: string, difference: any): Promise<ElementResponse> {
    if (difference.hasOwnProperty("state")) {
      switch (difference.state) {
        case "play":
          switch (this.nR.id) {
            // mock player requested
            case this.nR.id:
              this.nR.play();
              break;
            default:
              return { status: "error", error: new Error("Renderer not found"), code: 404 };
          }
          break;
        default:
          switch (this.nR.id) {
            // mock player requested
            case this.nR.id:
              this.nR.stop();
              break;
            default:
              return { status: "error", error: new Error("Renderer not found"), code: 404 };
          }
          break;
      }
    }
    if (difference.hasOwnProperty("shuffle")) {
      if (-1 !== ["off", "on"].indexOf(difference.shuffle)) {
        this.nR.setShuffle(difference.shuffle);
      }
    }
    if (difference.hasOwnProperty("repeat")) {
      if (-1 !== ["off", "repeatone", "repeatall"].indexOf(difference.repeat)) {
        this.nR.setShuffle(difference.repeat);
      }
    }
    if (difference.hasOwnProperty("currentMediaItem")) {

      if ( 1 === 1) {
        throw new Error("Not implemeneted yet");
        // propertiesChanged.push("currentMediaItem");
      } else {
        return { status: "error", error: new Error("currentMediaItem not found"), code: 500 };
      }
    }
    this.nR.next();
    return { status: "ok" };
  }
}
