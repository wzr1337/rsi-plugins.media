import { BehaviorSubject } from "rxjs";
import { ICollectionObject, IRendererElement } from "../schema";
export declare class NetfluxRenderer extends BehaviorSubject<IRendererElement> {
    private service;
    private resource;
    private mediaCollection;
    private interval;
    private renderer;
    private propertiesChanged;
    private shuffleMode;
    private logger;
    constructor(service: any, resource: any, mediaCollection: ICollectionObject);
    play(): void;
    pause(): void;
    stop(): void;
    setShuffle(mode: "on" | "off"): void;
    setRepeat(mode: "off" | "repeatall" | "repeatone"): void;
    next(): void;
    readonly id: string;
}
