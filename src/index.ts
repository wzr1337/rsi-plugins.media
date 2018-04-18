import { Service } from "@rsi/core";
import { Media } from "./media";
import { Medialibrary } from "./medialibrary";

const getPlugins = (): Array<typeof Service> => {
  return [ Medialibrary, Media ];
};

export { Media, Medialibrary, getPlugins };
