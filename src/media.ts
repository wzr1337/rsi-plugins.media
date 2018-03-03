import { Service } from "@rsi/core";

import { Collections } from "./collections";
import { Renderers } from "./renderers";

export class Media extends Service {
  constructor() {
    super();
    this.id = "f9a1073f-e90c-4c56-8368-f4c6bd1d8c96"; // random id
    this.resources.push(new Renderers(this));
    this.resources.push(new Collections(this));
  }
}
