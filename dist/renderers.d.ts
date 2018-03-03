import { CollectionResponse, ElementResponse, Resource, Service } from "@rsi/core";
export declare class Renderers extends Resource {
    static netfluxRendererId: string;
    private renderers;
    private logger;
    private interval;
    constructor(service: Service);
    readonly elementSubscribable: boolean;
    getElement(elementId: string): Promise<ElementResponse>;
    getResource(offset?: string | number, limit?: string | number): Promise<CollectionResponse>;
    updateElement(elementId: string, difference: any): Promise<ElementResponse>;
}
