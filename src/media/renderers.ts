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

import { NetfluxRenderer } from "./renderers/netflux";
import { ICollectionObject, IRendererElement, IRendererObject } from "./schema";

export class Renderers extends Resource {
  private netfluxRenderer: NetfluxRenderer;
  private logger = RsiLogger.getInstance().getLogger("media.Renderers");

  constructor(service: Service, private mediaCollection: ICollectionObject) {
    super(service);
    this.netfluxRenderer = new NetfluxRenderer(service, this, mediaCollection);
    this.addElement(this.netfluxRenderer);
  }

  get elementSubscribable(): boolean {
    return true;
  }

  public async updateElement(elementId: string, difference: any): Promise<ElementResponse> {
    if (difference.hasOwnProperty("state")) {
      switch (difference.state) {
        case "play":
          switch (this.netfluxRenderer.id) {
            // mock player requested
            case this.netfluxRenderer.id:
              this.netfluxRenderer.play();
              break;
            default:
              return { status: "error", error: new Error("Renderer not found"), code: 404 };
          }
          break;
        default:
          switch (this.netfluxRenderer.id) {
            // mock player requested
            case this.netfluxRenderer.id:
              this.netfluxRenderer.stop();
              break;
            default:
              return { status: "error", error: new Error("Renderer not found"), code: 404 };
          }
          break;
      }
    }
    if (difference.hasOwnProperty("shuffle")) {
      if (-1 !== ["off", "on"].indexOf(difference.shuffle)) {
        this.netfluxRenderer.setShuffle(difference.shuffle);
      }
    }
    if (difference.hasOwnProperty("repeat")) {
      if (-1 !== ["off", "repeatone", "repeatall"].indexOf(difference.repeat)) {
        this.netfluxRenderer.setShuffle(difference.repeat);
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
    this.netfluxRenderer.next();
    return { status: "ok" };
  }
}
