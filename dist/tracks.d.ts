import { CollectionResponse, ElementResponse, IElement, Resource, Service } from "@rsi/core";
import { BehaviorSubject } from "rxjs";
export declare class Tracks extends Resource {
    private tracks;
    constructor(service: Service);
    readonly elementSubscribable: boolean;
    readonly elements: Array<BehaviorSubject<IElement>>;
    getElement(elementId: string): Promise<ElementResponse>;
    getResource(offset?: string | number, limit?: string | number): Promise<CollectionResponse>;
}
