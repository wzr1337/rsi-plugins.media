import { CollectionResponse, ElementResponse, Resource, Service } from "@rsi/core";
export declare class Collections extends Resource {
    private collections;
    private medialibrary;
    private tracks;
    private logger;
    constructor(service: Service);
    readonly name: string;
    readonly elementSubscribable: boolean;
    readonly resourceSubscribable: boolean;
    getElement(elementId: string): Promise<ElementResponse>;
    createElement(state: any): Promise<ElementResponse>;
    updateElement(elementId: string, difference: any): Promise<ElementResponse>;
    deleteElement(elementId: string): Promise<ElementResponse>;
    getResource(offset?: string | number, limit?: string | number): Promise<CollectionResponse>;
    private _setItems(itemuris);
}
