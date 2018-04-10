import * as fs from "fs";
import * as path from "path";
import * as uuid from "uuid";

import { Cdn } from "@rsi/cdn";
import { RsiLogger, Service } from "@rsi/core";

import { Media } from "../media";
import { Tracks } from "./tracks";

class Medialibrary extends Service {
  constructor() {
    super();
    this.id = "ea65d5eb-d5fb-4ceb-a568-ed24fcf37e20"; // random id
    this.resources.push(new Tracks(this));
  }
}

export { Medialibrary, Media, Tracks };
