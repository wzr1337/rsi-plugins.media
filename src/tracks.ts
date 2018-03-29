import * as fs from "fs";
import * as path from "path";

import {
  CollectionResponse,
  ElementResponse,
  IElement,
  IResourceUpdate,
  Resource,
  Service,
} from "@rsi/core";
import { BehaviorSubject, Subject } from "rxjs";

import { ITrackObject } from "./schema";

interface ITracksElement extends IElement {
  data: ITrackObject;
}

export class Tracks extends Resource {
  private tracks: Array<BehaviorSubject<ITracksElement>> = [];

  // private _logger = RsiLogger.getInstance().getLogger("media");

  constructor(service: Service) {
    super(service);
    const mocksPath = path.join(__dirname, "..", "data", "mocks.json");

    const mocks = JSON.parse(fs.readFileSync(mocksPath).toString());
    for (const idx in mocks.tracks) {
      if (mocks.tracks.hasOwnProperty(idx)) {
        const track = mocks.tracks[idx];
        const trackObject = new BehaviorSubject<ITracksElement>({
          data: Object.assign(
            {
              uri:
                "/" +
                this.service.name +
                "/" +
                this.name +
                "/" +
                track.id
            },
            track
          ),
          lastUpdate: Date.now(),
          propertiesChanged: []
        });
        this.tracks.push(trackObject);
      }
    }

    this._change = new BehaviorSubject({ lastUpdate: Date.now(), action: "init" } as IResourceUpdate);
  }

  get elementSubscribable(): boolean {
    return true;
  }

  get elements(): Array<BehaviorSubject<IElement>> {
    return this.tracks;
  }

  public async getElement(elementId: string): Promise<ElementResponse> {
    // find the element requested by the client
    return {
      data: this.tracks.find((element: BehaviorSubject<ITracksElement>) => {
        return (element.getValue().data as { id: string }).id === elementId;
      }),
      status: "ok"
    };
  }

  public async getResource(
    offset?: string | number,
    limit?: string | number
  ): Promise<CollectionResponse> {
    // retriev all element
    let resp: Array<BehaviorSubject<ITracksElement>>;

    if (
      (typeof offset === "number" && typeof limit === "number") ||
      (typeof limit === "number" && !offset) ||
      (typeof offset === "number" && !limit) ||
      (!offset && !limit)
    ) {
      resp = this.tracks.slice(offset as number, limit as number);
    }

    return { status: "ok", data: resp };
  }
}
