import { BehaviorSubject } from "rxjs";
import { CollectionResponse, ElementResponse, IElement, Resource, Service } from "@rsi/core";
import { CollectionObject } from "./media.types";
export declare class Renderers extends Resource {
    readonly id: string;
    private renderers;
    private logger;
    private interval;
    constructor(service: Service, initialCollection: CollectionObject);
    readonly elementSubscribable: boolean;
    readonly elements: Array<BehaviorSubject<IElement>>;
    getElement(elementId: string): Promise<ElementResponse>;
    getResource(offset?: string | number, limit?: string | number): Promise<CollectionResponse>;
    updateElement(elementId: string, difference: any): Promise<ElementResponse>;
}
