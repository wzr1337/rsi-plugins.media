import { BehaviorSubject, Subject } from 'rxjs';
import * as uuid from "uuid";
import * as path from "path";
import * as fs from "fs";
import { rsiLogger } from "@rsi/core";

import { Service, Resource, Element, ResourceUpdate, StatusCode, ElementResponse, CollectionResponse } from "@rsi/core";
import { trackObject } from "./schema";

import { Cdn } from "@rsi/server";

class Medialibrary extends Service {
  constructor() {
    super();
    this.id = "ea65d5eb-d5fb-4ceb-a568-ed24fcf37e20"; //random id
    this.resources.push(new Tracks(this));

    let cnd = Cdn.getInstance();
    cnd.register('images', 'RLA6JMJK_normal.jpg', (image:string):Buffer => {
    
      rsiLogger.getInstance().getLogger("cdn.callback").log('debug', `Looking for ${image}`);
      var img:Buffer;

      let data = "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";
      

      // from base64 string
      img = Buffer.from(data, 'base64');

      return img;
    });
  }

}

interface TracksElement extends Element {
  data: trackObject;
}

class Tracks implements Resource {

  private _name:string;
  private _tracks:BehaviorSubject<TracksElement>[] = [];
  private _change:BehaviorSubject<ResourceUpdate>;

  //private _logger = rsiLogger.getInstance().getLogger("media");

  constructor(private service:Service) {
    let mocksPath = path.join(__dirname, "..", "data", "mocks.json");

    let mocks = JSON.parse(fs.readFileSync(mocksPath).toString());
    for (var idx in mocks.tracks) {
      if (mocks.tracks.hasOwnProperty(idx)) {
        let track = mocks.tracks[idx];
        let trackObject = new BehaviorSubject<TracksElement>({
          lastUpdate: Date.now(),
          propertiesChanged: [],
          data: Object.assign({
            uri: "/" + this.service.name.toLowerCase() + "/" + this.name.toLowerCase() + "/" + track.id
          }, track)
        });
        this._tracks.push(trackObject);
      }
    }

    this._change = new BehaviorSubject(<ResourceUpdate>{lastUpdate: Date.now(), action: 'init'});
  }

  get name():string {
    return this.constructor.name;
  };

  get elementSubscribable():Boolean {
    return true;
  };

  get change():BehaviorSubject<ResourceUpdate> {
    return this._change;
  }

  getElement(elementId:string):ElementResponse {
    // find the element requested by the client
    return {
      status: "ok",
      data: this._tracks.find((element:BehaviorSubject<TracksElement>) => {
      return (<{id:string}>element.getValue().data).id === elementId;
    })
    };
  };

  getResource(offset?:string|number, limit?:string|number):CollectionResponse{
    // retriev all element
    let resp:BehaviorSubject<TracksElement>[];

    if((typeof offset === "number" && typeof limit === "number") || (typeof limit === "number" && !offset) || (typeof offset === "number" && !limit) || (!offset && !limit)) {
      resp = this._tracks.slice(<number>offset, <number>limit);
    }

    return {status: "ok", data: resp};
  };
}


export {Medialibrary as Service};