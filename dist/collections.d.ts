import { ElementResponse, Resource, Service } from "@rsi/core";
export declare class Collections extends Resource {
    private medialibrary;
    private tracks;
    private logger;
    constructor(service: Service);
    readonly name: string;
    readonly elementSubscribable: boolean;
    readonly resourceSubscribable: boolean;
    createElement(state: any): Promise<ElementResponse>;
    updateElement(elementId: string, difference: any): Promise<ElementResponse>;
    deleteElement(elementId: string): Promise<ElementResponse>;
    private _setItems(itemuris);
}
