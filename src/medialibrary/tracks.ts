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
        this.addElement(trackObject);
      }
    }

    this._change = new BehaviorSubject({ lastUpdate: Date.now(), action: "init" } as IResourceUpdate);
  }

  get elementSubscribable(): boolean {
    return true;
  }

}
