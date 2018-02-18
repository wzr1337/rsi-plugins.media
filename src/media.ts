import { BehaviorSubject } from 'rxjs';
import * as uuid from "uuid";
import { rsiLogger, Service, Resource, Element, ResourceUpdate, StatusCode, ElementResponse, CollectionResponse } from "@rsi/core";

import { RendererObject, CollectionObject, ItemObject } from "./media.types";
import { Medialibrary, Tracks } from "./medialibrary";


class Media extends Service {
  constructor() {
    super();
    this.id = "f9a1073f-e90c-4c56-8368-f4c6bd1d8c96"; //random id
    this._resources.push(new Renderers(this));
    this._resources.push(new Collections(this));
  }
}

interface RendererElement extends Element {
  data: RendererObject;
}

class Renderers extends Resource {

  static netfluxRendererId = "d6ebfd90-d2c1-11e6-9376-df943f51f0d8";//uuid.v1();  // FIXED for now

  private _renderers: BehaviorSubject<RendererElement>[] = [];

  private _logger = rsiLogger.getInstance().getLogger("media.Renderers");

  constructor(private service: Service) {
    super();
    //let collections = service.resources.filter<Collections>(resource => resource.name === "collections");
    //const initialCollection = collections.map( element => element.name === "default");
    let netfluxRenderer = new BehaviorSubject<RendererElement>({
      lastUpdate: Date.now(),
      propertiesChanged: [],
      data: {
        uri: "/" + this.service.name.toLowerCase() + "/" + this.name.toLowerCase() + "/" + Renderers.netfluxRendererId,
        id: Renderers.netfluxRendererId,
        name: "Netflux",
        state: "idle",
        shuffle: "off",
        repeat: "off",
        offset: 0,
        media: "initialCollection"
      }
    });
    this._renderers.push(netfluxRenderer);

    this._change = new BehaviorSubject(<ResourceUpdate>{ lastUpdate: Date.now(), action: 'init' });
  }

  get elementSubscribable(): Boolean {
    return true;
  };

  async getElement(elementId: string): Promise<ElementResponse> {
    // find the element requested by the client
    var data = this._renderers.find((element: BehaviorSubject<RendererElement>) => {
      if (element) return (<{ id: string }>element.getValue().data).id === elementId;
      return undefined;
    });
    return data ? {
      status: "ok",
      data: data
    } : undefined;
  };

  async getResource(offset?: string | number, limit?: string | number): Promise<CollectionResponse> {
    // retriev all element
    let resp: BehaviorSubject<RendererElement>[];

    if ((typeof offset === "number" && typeof limit === "number") || (typeof limit === "number" && !offset) || (typeof offset === "number" && !limit) || (!offset && !limit)) {
      resp = this._renderers.slice(<number>offset, <number>limit);
    }

    return { status: "ok", data: resp };
  };


  private _interval: NodeJS.Timer; //@TODO has to become per-renderer

  async updateElement(elementId: string, difference: any): Promise<ElementResponse> {
    let element:BehaviorSubject<RendererElement> = (await this.getElement(elementId)).data;
    var renderer: RendererObject = element.getValue().data;
    let propertiesChanged: string[] = [];

    if (difference.hasOwnProperty("state")) {
      renderer.state = difference.state;

      switch (difference.state) {
        case "play":
          if (renderer.id === Renderers.netfluxRendererId) {
            const speed = 1000;
            this._interval = setInterval(() => {
              renderer.offset = renderer.hasOwnProperty("offset") ? renderer.offset + speed : 0;
              element.next(
                {
                  lastUpdate: Date.now(),
                  propertiesChanged: ["offset"],
                  data: renderer
                });
              }, speed);
            }
          break;
        default:
          switch (renderer.id) {

            // mock player requested
            case Renderers.netfluxRendererId:
              clearInterval(this._interval);
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
    let resp = {
      lastUpdate: Date.now(),
      propertiesChanged: propertiesChanged,
      data: renderer
    };
    element.next(resp); // @TODO: check diffs bevor updating without a need
    return { status: "ok" };
  }
}


interface CollectionElement extends Element {
  data: CollectionObject
}

class Collections extends Resource {
  private _collections: BehaviorSubject<CollectionElement>[] = [];
  private _medialibrary: Medialibrary;
  private _tracks: Tracks;

  private _logger = rsiLogger.getInstance().getLogger("media.Collections");

  constructor(private service: Service) {
    super();
    const collectionId = "deadbeef-d2c1-11e6-9376-df943f51f0d8";
    let initialCollection = new BehaviorSubject<CollectionElement>(
      {
        lastUpdate: Date.now(),
        propertiesChanged: [],
        data: {
          uri: "/" + this.service.name.toLowerCase() + "/" + this.name.toLowerCase() + "/" + collectionId,
          id: collectionId,
          name: "default",
          items: []
        }
      });
    this._collections.push(initialCollection);
    this._change = new BehaviorSubject(<ResourceUpdate>{ lastUpdate: Date.now(), action: 'init' });
    this._medialibrary = new Medialibrary();
    this._tracks =  <Tracks>this._medialibrary.getResource("Tracks");
  }

  get name(): string {
    return this.constructor.name;
  };

  get elementSubscribable(): Boolean {
    return true;
  };

  get resourceSubscribable(): Boolean {
    return true;
  };

  private async _setItems(itemuris: string[]): Promise<ItemObject[] | ElementResponse> {
    let _items: ItemObject[] = [];
    let regex = /[\w\/\:]*([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fAF]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/
    let errors: string[] = [];
    if (this._tracks) {
      for (var index in itemuris) {
        let uri = itemuris[index];
        let match = uri.match(regex);
        if (match !== null) {
          let id = match[1];
          if (!id) {
            errors.push("Id " + id + "not valid from uri: " + uri);
          } else {
            let track = await this._tracks.getElement(id);
            if (track && track.data) {
              _items.push(track.data.getValue().data);
            }
            else {
              errors.push("Track " + id + " can not be found");
            }
          }
        }
      }
      if (errors.length != 0) {
        return { status: "error", error: new Error(errors.join(",")), code: 400 };
      }
    } else {
      return { status: "error", error: new Error("No tracks loaded..."), code: 500 };
    }
    return _items;
  }

  async getElement(elementId: string): Promise<ElementResponse> {
    // find the element requested by the client
    return {
      status: "ok",
      data: this._collections.find((element: BehaviorSubject<CollectionElement>) => {
        return (<{ id: string }>element.getValue().data).id === elementId;
      })
    };
  };

  async createElement(state: any): Promise<ElementResponse> {
    if (!state.name) return {
      status: "error",
      error: new Error('providing a name is mandatory'),
      code: StatusCode.INTERNAL_SERVER_ERROR
    };
    const collectionId = uuid.v1();
    let items: any = [];

    /** add items given with the query */
    if (state.hasOwnProperty('items')) {
      items = await this._setItems(state.items);
      if (!Array.isArray(items)) return items;
    }

    /** build the actual media collection and add it to the collections*/
    let newCollection = new BehaviorSubject<CollectionElement>(
      {
        lastUpdate: Date.now(),
        propertiesChanged: [],
        data: {
          uri: "/" + this.service.name.toLowerCase() + "/" + this.name.toLowerCase() + "/" + collectionId,
          id: collectionId,
          name: state.name,
          items: items
        }
      });
    this._collections.push(newCollection);

    /** publish a resource change */
    this._change.next({ lastUpdate: Date.now(), action: "add" });

    /** return success */
    return { status: "ok", data: newCollection };
  };

  async updateElement(elementId: string, difference: any): Promise<ElementResponse> {
    let element = (await this.getElement(elementId)).data;
    var collection: CollectionElement = element.getValue();
    let propertiesChanged: string[] = [];

    if (difference.hasOwnProperty('items')) {
      let newItems = await this._setItems(difference.items);
      if (!Array.isArray(newItems)) return newItems;
      collection.data.items = newItems;
      collection.lastUpdate = Date.now();
      collection.propertiesChanged = ['items'];
      element.next(collection);
      return { status: "ok" };
    }
    return { status: "error", code: 400, message: "No actions to take.." };
  }

  async deleteElement(elementId: string): Promise<ElementResponse> {
    let idx = this._collections.findIndex((element: BehaviorSubject<CollectionElement>, index: number) => {
      return (<{ id: string }>element.getValue().data).id === elementId;
    });
    if (-1 !== idx) {
      this._collections.splice(idx, 1); //remove one item from the collections array
      return { status: "ok" };
    }
    return { status: "error", code: 404, message: "Element can not be found" };
  }

  async getResource(offset?: string | number, limit?: string | number): Promise<CollectionResponse> {
    // retriev all element
    let resp: BehaviorSubject<CollectionElement>[];

    if ((typeof offset === "number" && typeof limit === "number") || (typeof limit === "number" && !offset) || (typeof offset === "number" && !limit) || (!offset && !limit)) {
      resp = this._collections.slice(<number>offset, <number>limit);
    }

    return { status: "ok", data: resp };
  };
}

export { Media, Renderers, Collections };