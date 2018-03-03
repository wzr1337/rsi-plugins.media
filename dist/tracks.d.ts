import { CollectionResponse, ElementResponse, Resource, Service } from "@rsi/core";
export declare class Tracks extends Resource {
    private tracks;
    constructor(service: Service);
    readonly elementSubscribable: boolean;
    getElement(elementId: string): Promise<ElementResponse>;
    getResource(offset?: string | number, limit?: string | number): Promise<CollectionResponse>;
}
