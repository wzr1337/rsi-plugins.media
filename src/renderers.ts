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
    this.renderers.push(this.nR.subject);

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
    const element: BehaviorSubject<IRendererElement> = (await this.getElement(elementId)).data;
    const renderer: IRendererObject = element.getValue().data;
    const propertiesChanged: string[] = [];

    if (difference.hasOwnProperty("state")) {
      renderer.state = difference.state;

      switch (difference.state) {
        case "play":
          switch (renderer.id) {
            // mock player requested
            case this.nR.id:
              this.nR.play();
              break;
            default:
              return { status: "error", error: new Error("Renderer not found"), code: 404 };
          }
          break;
        default:
          switch (renderer.id) {
            // mock player requested
            case this.nR.id:
              this.nR.stop();
              break;
            default:
              return { status: "error", error: new Error("Renderer not found"), code: 404 };
          }
          break;
      }
      propertiesChanged.push("state");
    }
    if (difference.hasOwnProperty("shuffle")) {
      if (-1 !== ["off", "on"].indexOf(difference.shuffle)) {
        renderer.shuffle = difference.shuffle;
        propertiesChanged.push("shuffle");
      }
    }
    if (difference.hasOwnProperty("repeat")) {
      if (-1 !== ["off", "one", "all"].indexOf(difference.repeat)) {
        renderer.repeat = difference.repeat;
        propertiesChanged.push("repeat");
      }
    }
    if (difference.hasOwnProperty("currentMediaItem")) {

      if ( 1 === 1) {

        propertiesChanged.push("currentMediaItem");
      } else {
        return { status: "error", error: new Error("currentMediaItem not found"), code: 500 };
      }
    }
    const resp = { data: renderer, lastUpdate: Date.now(), propertiesChanged };
    element.next(resp); // @TODO: check diffs bevor updating without a need
    return { status: "ok" };
  }
}
