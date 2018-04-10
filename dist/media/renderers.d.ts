import { ElementResponse, Resource, Service } from "@rsi/core";
import { ICollectionObject } from "./schema";
export declare class Renderers extends Resource {
    private mediaCollection;
    private netfluxRenderer;
    private logger;
    constructor(service: Service, mediaCollection: ICollectionObject);
    readonly elementSubscribable: boolean;
    updateElement(elementId: string, difference: any): Promise<ElementResponse>;
}
