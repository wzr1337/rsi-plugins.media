import { Service } from "@rsi/core";
import { Media } from "./media";
import { Medialibrary } from "./medialibrary";

const getPlugins = (): Array<new () => Service> => {
  return [ Medialibrary, Media ];
};

export { Media, Medialibrary, getPlugins };
