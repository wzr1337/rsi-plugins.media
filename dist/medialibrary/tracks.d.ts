import { Resource, Service } from "@rsi/core";
export declare class Tracks extends Resource {
    private logger;
    constructor(service: Service);
    readonly elementSubscribable: boolean;
}
