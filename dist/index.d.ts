import { Service } from "@rsi/core";
import { Media } from "./media";
import { Medialibrary } from "./medialibrary";
declare const getPlugins: () => (typeof Service)[];
export { Media, Medialibrary, getPlugins };
