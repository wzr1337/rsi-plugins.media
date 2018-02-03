import { Service } from "@rsi/core";
declare class Medialibrary extends Service {
    constructor();
}
declare const getPlugins: () => (new () => Service)[];
export { Medialibrary, getPlugins };
