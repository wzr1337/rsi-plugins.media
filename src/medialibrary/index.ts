import { Service } from "@rsi/core";
import { Tracks } from "./tracks";

class Medialibrary extends Service {
  public readonly id: string = "ea65d5eb-d5fb-4ceb-a568-ed24fcf37e20"; // random id

  protected constructor() {
    super();
    this.resources.push(new Tracks(this));
  }
}

export { Medialibrary, Tracks };
