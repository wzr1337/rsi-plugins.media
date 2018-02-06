import { BehaviorSubject } from 'rxjs';
import { Service, Resource, ResourceUpdate, ElementResponse, CollectionResponse } from "@rsi/core";
declare class Media extends Service {
    constructor();
}
declare class Renderers implements Resource {
    private service;
    static netfluxRendererId: string;
    private _name;
    private _renderers;
    private _change;
    private _logger;
    constructor(service: Service);
    readonly name: string;
    readonly elementSubscribable: Boolean;
    readonly change: BehaviorSubject<ResourceUpdate>;
    getElement(elementId: string): ElementResponse;
    getResource(offset?: string | number, limit?: string | number): CollectionResponse;
    private _interval;
    updateElement(elementId: string, difference: any): ElementResponse;
}
declare class Collections implements Resource {
    private service;
    private _collections;
    private _change;
    private _medialibrary;
    private _tracks;
    private _logger;
    constructor(service: Service);
    readonly name: string;
    readonly elementSubscribable: Boolean;
    readonly resourceSubscribable: Boolean;
    readonly change: BehaviorSubject<ResourceUpdate>;
    private _setItems(itemuris);
    getElement(elementId: string): ElementResponse;
    createElement(state: any): ElementResponse;
    updateElement(elementId: string, difference: any): ElementResponse;
    deleteElement(elementId: string): ElementResponse;
    getResource(offset?: string | number, limit?: string | number): CollectionResponse;
}
export { Media, Renderers, Collections };
