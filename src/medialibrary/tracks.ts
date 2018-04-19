import * as fs from "fs";
import * as path from "path";

import {
  CollectionResponse,
  ElementResponse,
  IElement,
  IResourceUpdate,
  Resource,
  RsiLogger,
  Service,
} from "@rsi/core";
import { BehaviorSubject, Subject } from "rxjs";

import { Cdn } from "@rsi/cdn";
import { ITrackObject } from "./schema";

interface ITracksElement extends IElement {
  data: ITrackObject;
}

export class Tracks extends Resource {

  private logger = RsiLogger.getInstance().getLogger("medialibrary.Tracks");

  constructor(service: Service) {
    super(service);
    const dataPath = path.join(__dirname, "..", "..", "data");

    const mocks = JSON.parse(fs.readFileSync(path.join(dataPath, "mocks.json")).toString());
    for (const idx in mocks.tracks) {
      if (mocks.tracks.hasOwnProperty(idx)) {
        const track = mocks.tracks[idx];

        track.image = Cdn.getInstance().register("images", path.basename(track.image),
            (resourceName: string, fileName: string): Buffer => {
          return fs.readFileSync(path.join(dataPath, fileName));
        });

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
