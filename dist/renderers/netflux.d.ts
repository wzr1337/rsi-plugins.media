import { BehaviorSubject } from "rxjs";
import { ICollectionObject, IRendererElement } from "../media.types";
export declare class NetfluxRenderer {
    private service;
    private resource;
    private mediaCollection;
    readonly subject: BehaviorSubject<IRendererElement>;
    readonly id: any;
    private interval;
    private renderer;
    private logger;
    constructor(service: any, resource: any, mediaCollection: ICollectionObject);
    play(): void;
    pause(): void;
    stop(): void;
}
