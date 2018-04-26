import { Service } from "@rsi/core";
import { Media } from "../media";
import { Tracks } from "./tracks";
declare class Medialibrary extends Service {
    readonly id: string;
    protected constructor();
}
export { Medialibrary, Media, Tracks };
