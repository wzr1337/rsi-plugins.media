import { IElement, Service } from "@rsi/core";
import { BehaviorSubject } from "rxjs";
import { Collections } from "./collections";
import { Renderers } from "./renderers";

export class Media extends Service {
  public readonly id = "f9a1073f-e90c-4c56-8368-f4c6bd1d8c96"; // random id

  constructor() {
    super();
    const collections = new Collections(this);
    this.resources.push(collections);
    // tslint:disable-next-line:max-line-length
    const initialCollection: BehaviorSubject<IElement> = collections.elements.filter((element) => element.getValue().data.name === "default")[0];
    this.resources.push(new Renderers(this, initialCollection.getValue().data));
  }
}
