import { Media } from "./media";
import { Medialibrary } from "./medialibrary";
import { Service } from "@rsi/core";
declare const getPlugins: () => (new () => Service)[];
export { Media, Medialibrary, getPlugins };
