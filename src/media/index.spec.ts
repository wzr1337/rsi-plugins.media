import { Media } from ".";

describe("Media", () => { // empty
  it ("should have an id", () => {
    const media = Media.getInstance();
    expect(media.id).toBeDefined();
  });
});
