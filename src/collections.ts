import { BehaviorSubject } from "rxjs";
import { v1 } from "uuid";

import {
  CollectionResponse,
  ElementResponse,
  IElement,
  IResourceUpdate,
  Resource,
  RsiLogger,
  Service,
  StatusCode
} from "@rsi/core";

import { ICollectionObject, IitemObject } from "./media.types";
import { Medialibrary, Tracks } from "./medialibrary";

interface ICollectionElement extends IElement {
  data: ICollectionObject;
}

export class Collections extends Resource {
  private collections: Array<BehaviorSubject<ICollectionElement>> = [];
  private medialibrary: Medialibrary;
  private tracks: Tracks;
  private logger = RsiLogger.getInstance().getLogger("media.Collections");

  constructor(service: Service) {
    super(service);
    const collectionId = "deadbeef-d2c1-11e6-9376-df943f51f0d8";
    const initialCollection = new BehaviorSubject<ICollectionElement>({
      data: {
        id: collectionId,
        items: [],
        name: "default",
        uri:
        "/" +
        this.service.name.toLowerCase() +
        "/" +
        this.name.toLowerCase() +
        "/" +
        collectionId
      },
      lastUpdate: Date.now(),
      propertiesChanged: []
    });
    this.collections.push(initialCollection);
    this._change = new BehaviorSubject({ lastUpdate: Date.now(), action: "init" } as IResourceUpdate);
    this.medialibrary = new Medialibrary();
    this.tracks = this.medialibrary.getResource("Tracks") as Tracks;
  }

  get name(): string {
    return this.constructor.name;
  }

  get elementSubscribable(): boolean {
    return true;
  }

  get resourceSubscribable(): boolean {
    return true;
  }

  public async getElement(elementId: string): Promise<ElementResponse> {
    // find the element requested by the client
    return {
      data: this.collections.find((element: BehaviorSubject<ICollectionElement>) => {
        return (element.getValue().data as { id: string }).id === elementId;
      }),
      status: "ok"
    };
  }

  public async createElement(state: any): Promise<ElementResponse> {
    if (!state.name) {
      return {
        code: StatusCode.INTERNAL_SERVER_ERROR,
        error: new Error("providing a name is mandatory"),
        status: "error"
      };
    }
    const collectionId = v1();
    let items: any = [];

    /** add items given with the query */
    if (state.hasOwnProperty("items")) {
      items = await this._setItems(state.items);
      if (!Array.isArray(items)) {
        return items;
      }
    }

    /**
     * build the actual media collection and add it to the collections
     */
    const newCollection = new BehaviorSubject<ICollectionElement>({
      data: {
        id: collectionId,
        items,
        name: state.name,
        uri:
        "/" +
        this.service.name.toLowerCase() +
        "/" +
        this.name.toLowerCase() +
        "/" +
        collectionId
      },
      lastUpdate: Date.now(),
      propertiesChanged: []
    });
    this.collections.push(newCollection);

    /** publish a resource change */
    this._change.next({ lastUpdate: Date.now(), action: "add" });

    /** return success */
    return { status: "ok", data: newCollection };
  }

  public async updateElement(elementId: string, difference: any): Promise<ElementResponse> {
    const element = (await this.getElement(elementId)).data;
    const collection: ICollectionElement = element.getValue();
    const propertiesChanged: string[] = [];

    if (difference.hasOwnProperty("items")) {
      const newItems = await this._setItems(difference.items);
      if (!Array.isArray(newItems)) {
        return newItems;
      }
      collection.data.items = newItems;
      collection.lastUpdate = Date.now();
      collection.propertiesChanged = ["items"];
      element.next(collection);
      return { status: "ok" };
    }
    return { status: "error", code: 400, message: "No actions to take.." };
  }

  public async deleteElement(elementId: string): Promise<ElementResponse> {
    const idx = this.collections.findIndex(
      (element: BehaviorSubject<ICollectionElement>, index: number) => {
        return (element.getValue().data as { id: string }).id === elementId;
      }
    );
    if (-1 !== idx) {
      this.collections.splice(idx, 1); // remove one item from the collections array
      return { status: "ok" };
    }
    return { status: "error", code: 404, message: "Element can not be found" };
  }

  public async getResource(
    offset?: string | number,
    limit?: string | number
  ): Promise<CollectionResponse> {
    // retriev all element
    let resp: Array<BehaviorSubject<ICollectionElement>>;

    if (
      (typeof offset === "number" && typeof limit === "number") ||
      (typeof limit === "number" && !offset) ||
      (typeof offset === "number" && !limit) ||
      (!offset && !limit)
    ) {
      resp = this.collections.slice(offset as number, limit as number);
    }

    return { status: "ok", data: resp };
  }
  private async _setItems(itemuris: string[]): Promise<IitemObject[] | ElementResponse> {
    const items: IitemObject[] = [];
    const regex = /[\w\/\:]*([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fAF]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
    const errors: string[] = [];
    if (this.tracks) {
      for (const index in itemuris) {
        if (index && itemuris[index]) {
          const uri = itemuris[index];
          const match = uri.match(regex);
          if (match !== null) {
            const id = match[1];
            if (!id) {
              errors.push("Id " + id + "not valid from uri: " + uri);
            } else {
              const track = await this.tracks.getElement(id);
              if (track && track.data) {
                items.push(track.data.getValue().data);
              } else {
                errors.push("Track " + id + " can not be found");
              }
            }
          }
        }
      }
      if (errors.length !== 0) {
        return { status: "error", error: new Error(errors.join(",")), code: 400 };
      }
    } else {
      return { status: "error", error: new Error("No tracks loaded..."), code: 500 };
    }
    return items;
  }
}
