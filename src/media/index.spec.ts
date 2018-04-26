import { RsiLogger } from "@rsi/core";
import { Media } from ".";

beforeAll(() => {
  RsiLogger.getInstance().getLogger("cdn").level = "error"; // disbale cdn silly logs
});

describe("Media", () => { // empty
  xit ("should have an id", () => {
    const media = Media.getInstance();
    expect(media.id).toBeDefined();
  });
});
