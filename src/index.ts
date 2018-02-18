import { Media } from "./media";
import { Medialibrary } from "./medialibrary";
import { Service } from "@rsi/core/dist/rsiPlugin";

export const getPlugins = (): Array<new () => Service> => {
  return [Medialibrary, Media];
}