import { BehaviorSubject } from 'rxjs';
import { Service, Resource, ResourceUpdate, ElementResponse, CollectionResponse } from "@rsi/core";
declare class Medialibrary extends Service {
    constructor();
}
declare class Tracks implements Resource {
    private service;
    private _name;
    private _tracks;
    private _change;
    constructor(service: Service);
    readonly name: string;
    readonly elementSubscribable: Boolean;
    readonly change: BehaviorSubject<ResourceUpdate>;
    getElement(elementId: string): ElementResponse;
    getResource(offset?: string | number, limit?: string | number): CollectionResponse;
}
export { Medialibrary as Service, Tracks };
