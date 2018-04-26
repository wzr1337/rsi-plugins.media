import { RsiLogger } from "@rsi/core";
import { Medialibrary } from ".";

beforeAll(() => {
  RsiLogger.getInstance().getLogger("cdn").level = "error"; // disbale cdn silly logs
});

describe("Medialibrary", () => { // empty
  it ("should have an id", () => {
    const ml = Medialibrary.getInstance();
    expect(ml.id).toBeDefined();
  });

  it("should have resources", () => {
    const ml = Medialibrary.getInstance();
    expect(ml.resources).toBeDefined();
    expect(Array.isArray(ml.resources)).toBeTruthy();
  });

  it("should host a Tracks resource", () => {
    const ml = Medialibrary.getInstance();
    const res = ml.resources.find((element) => element.name.toLowerCase() === "tracks");
    expect(res).toBeDefined();
  });

});
