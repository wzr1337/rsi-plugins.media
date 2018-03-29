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

import { CollectionObject, RendererObject } from "./media.types";

interface IRendererElement extends IElement {
  data: RendererObject;
}

export class Renderers extends Resource {
  public readonly id = "d6ebfd90-d2c1-11e6-9376-df943f51f0d8"; // uuid.v1();  // FIXED for now

  private renderers: Array<BehaviorSubject<IRendererElement>> = [];

  private logger = RsiLogger.getInstance().getLogger("media.Renderers");
  private interval: NodeJS.Timer; // @TODO has to become per-renderer

  constructor(service: Service, initialCollection: CollectionObject) {
    super(service);
    console.log(initialCollection);

    const netfluxRenderer = new BehaviorSubject<IRendererElement>({
      data: {
        id: this.id,
        media: initialCollection,
        name: "Netflux",
        offset: 0,
        repeat: "off",
        shuffle: "off",
        state: "idle",
        uri:
          "/" +
          this.service.name +
          "/" +
          this.name +
          "/" +
          this.id
      },
      lastUpdate: Date.now(),
      propertiesChanged: []
    });
    this.renderers.push(netfluxRenderer);

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
    const renderer: RendererObject = element.getValue().data;
    const propertiesChanged: string[] = [];

    if (difference.hasOwnProperty("state")) {
      renderer.state = difference.state;

      switch (difference.state) {
        case "play":
          switch (renderer.id) {
            // mock player requested
            case this.id:
              const speed = 1000;
              this.interval = setInterval(() => {
                renderer.offset = renderer.hasOwnProperty("offset") ? renderer.offset + speed : 0;
                element.next({
                  data: renderer,
                  lastUpdate: Date.now(),
                  propertiesChanged: ["offset"]
                });
              }, speed);
              break;
            default:
              return { status: "error", error: new Error("Renderer not found"), code: 404 };
          }
          break;
        default:
          switch (renderer.id) {
            // mock player requested
            case this.id:
              clearInterval(this.interval);
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
    const resp = { data: renderer, lastUpdate: Date.now(), propertiesChanged };
    element.next(resp); // @TODO: check diffs bevor updating without a need
    return { status: "ok" };
  }
}
