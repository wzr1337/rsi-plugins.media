import { Media } from "./media";
import { Medialibrary } from "./medialibrary";
import { Service } from "@rsi/core";

const getPlugins = (): Array<new () => Service> => {
  return [ Medialibrary, Media ];
}

export { Media, Medialibrary, getPlugins };