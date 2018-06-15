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

import { Medialibrary, Tracks } from "../medialibrary";
import { ICollectionObject, ItemObject } from "./schema";

interface ICollectionElement extends IElement {
  data: ICollectionObject;
}

export class Collections extends Resource {
  private medialibrary: Medialibrary;
  private tracks: Tracks;
  private logger = RsiLogger.getInstance().getLogger("media.Collections");

  constructor(service: Service) {
    super(service);
    const collectionId = "deadbeef-d2c1-11e6-9376-df943f51f0d8";
    this.medialibrary = Medialibrary.getInstance();
    this.tracks = this.medialibrary.getResource("Tracks") as Tracks;
    if (! this.tracks) {
      throw new Error("Cannot load tracks from medialibrary. Did you add at least one?");
    }
    const items = this.tracks.elements[0] ? this.tracks.elements.slice(0, 5).map((track) => {
      return track.getValue().data;
    }) : [];
    const initialCollection = new BehaviorSubject<ICollectionElement>({
      data: {
        id: collectionId,
        items,
        name: "default",
        uri:
        "/" +
        this.service.name +
        "/" +
        this.name +
        "/" +
        collectionId
      },
      lastUpdate: Date.now(),
      propertiesChanged: []
    });
    this.addElement(initialCollection);
    this._change = new BehaviorSubject({ lastUpdate: Date.now(), action: "init" } as IResourceUpdate);
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
        this.service.name +
        "/" +
        this.name +
        "/" +
        collectionId
      },
      lastUpdate: Date.now(),
      propertiesChanged: []
    });
    this.addElement(newCollection);

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
    if (this.removeElement(elementId)) {
      return { status: "ok" };
    }
    return { status: "error", code: 404, message: "Element can not be found" };
  }

  private async _setItems(itemuris: string[]): Promise<ItemObject[] | ElementResponse> {
    const items: ItemObject[] = [];
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
