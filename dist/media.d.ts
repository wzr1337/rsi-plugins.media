import { Service, Resource, ElementResponse, CollectionResponse } from "@rsi/core";
declare class Media extends Service {
    constructor();
}
declare class Renderers extends Resource {
    private service;
    static netfluxRendererId: string;
    private _renderers;
    private _logger;
    constructor(service: Service);
    readonly elementSubscribable: Boolean;
    getElement(elementId: string): Promise<ElementResponse>;
    getResource(offset?: string | number, limit?: string | number): Promise<CollectionResponse>;
    private _interval;
    updateElement(elementId: string, difference: any): Promise<ElementResponse>;
}
declare class Collections extends Resource {
    private service;
    private _collections;
    private _medialibrary;
    private _tracks;
    private _logger;
    constructor(service: Service);
    readonly name: string;
    readonly elementSubscribable: Boolean;
    readonly resourceSubscribable: Boolean;
    private _setItems(itemuris);
    getElement(elementId: string): Promise<ElementResponse>;
    createElement(state: any): Promise<ElementResponse>;
    updateElement(elementId: string, difference: any): Promise<ElementResponse>;
    deleteElement(elementId: string): Promise<ElementResponse>;
    getResource(offset?: string | number, limit?: string | number): Promise<CollectionResponse>;
}
export { Media, Renderers, Collections };
