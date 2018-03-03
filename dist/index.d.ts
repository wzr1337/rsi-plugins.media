import { Service } from "@rsi/core";
import { Media } from "./media";
import { Medialibrary } from "./medialibrary";
declare const getPlugins: () => (new () => Service)[];
export { Media, Medialibrary, getPlugins };
