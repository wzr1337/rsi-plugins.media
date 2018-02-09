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
    getElement(elementId: string): Promise<ElementResponse>;
    getResource(offset?: string | number, limit?: string | number): Promise<CollectionResponse>;
    private _interval;
    updateElement(elementId: string, difference: any): Promise<ElementResponse>;
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
    getElement(elementId: string): Promise<ElementResponse>;
    createElement(state: any): Promise<ElementResponse>;
    updateElement(elementId: string, difference: any): Promise<ElementResponse>;
    deleteElement(elementId: string): Promise<ElementResponse>;
    getResource(offset?: string | number, limit?: string | number): Promise<CollectionResponse>;
}
export { Media, Renderers, Collections };
