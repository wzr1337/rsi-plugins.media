import { Service, Resource, ElementResponse, CollectionResponse } from "@rsi/core";
import { Media } from "./media";
declare class Medialibrary extends Service {
    constructor();
}
declare class Tracks extends Resource {
    private service;
    private _tracks;
    constructor(service: Service);
    readonly elementSubscribable: Boolean;
    getElement(elementId: string): Promise<ElementResponse>;
    getResource(offset?: string | number, limit?: string | number): Promise<CollectionResponse>;
}
declare const getPlugins: () => (new () => Service)[];
export { Medialibrary, Media, Tracks, getPlugins };
