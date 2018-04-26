import { CollectionResponse, ElementResponse, IElement, Service } from "@rsi/core";
import { BehaviorSubject } from "rxjs";
import { getPlugins } from "./index";

describe("general", () => { // empty
  it("should be true", (done: DoneFn) => {
    expect(1).toBeTruthy();
    done();
  });

  it ("should return a list of services ", () => {
    expect(Array.isArray(getPlugins())).toBeTruthy();
  });
});
