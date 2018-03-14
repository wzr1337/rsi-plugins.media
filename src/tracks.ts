import { BehaviorSubject } from "rxjs";

import {
  CollectionResponse,
  ElementResponse,
  IElement,
  IResourceUpdate,
  Resource,
  Service,
} from "@rsi/core";

import { ITrackObject } from "./schema";

import mocks from "../data/mocks.json";

interface ITracksElement extends IElement {
  data: ITrackObject;
}
export class Tracks extends Resource {
  private tracks: Array<BehaviorSubject<ITracksElement>> = [];

  // private _logger = RsiLogger.getInstance().getLogger("media");

  constructor(service: Service) {
    super(service);
    // const mocksPath = join(__dirname, "..", "data", "mocks.json");
    // const mocks = JSON.parse(readFileSync(mocksPath).toString());

    for (const idx in mocks.tracks) {
      if (mocks.tracks.hasOwnProperty(idx)) {
        const track = mocks.tracks[idx];
        const serviceName = this.service.name.toLowerCase();
        const name = this.name.toLowerCase();
        const id = track.id;
        const trackObject = new BehaviorSubject<ITracksElement>({
          data: Object.assign({ uri: `/${serviceName}/${name}/${id}` }, track),
          lastUpdate: Date.now(),
          propertiesChanged: []
        });
        this.tracks.push(trackObject);
      }
    }

    this._change = new BehaviorSubject({
      action: "init",
      lastUpdate: Date.now()
    } as IResourceUpdate);
  }

  get elementSubscribable(): boolean {
    return true;
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
    resp = this.tracks.slice(
      this.castToNumberOrUndefined(offset),
      this.castToNumberOrUndefined(limit)
    );
    return { status: "ok", data: resp };
  }
  private castToNumberOrUndefined(figure?: any): number | undefined {
    return typeof figure === "number" ? figure : undefined;
  }
}
