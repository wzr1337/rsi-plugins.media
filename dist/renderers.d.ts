import { BehaviorSubject } from "rxjs";
import { CollectionResponse, ElementResponse, IElement, Resource, Service } from "@rsi/core";
import { ICollectionObject } from "./media.types";
export declare class Renderers extends Resource {
    private mediaCollection;
    private renderers;
    private nR;
    private logger;
    constructor(service: Service, mediaCollection: ICollectionObject);
    readonly elementSubscribable: boolean;
    readonly elements: Array<BehaviorSubject<IElement>>;
    getElement(elementId: string): Promise<ElementResponse>;
    getResource(offset?: string | number, limit?: string | number): Promise<CollectionResponse>;
    updateElement(elementId: string, difference: any): Promise<ElementResponse>;
}
