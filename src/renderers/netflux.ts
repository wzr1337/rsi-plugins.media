import { IRsiLoggerInstance, RsiLogger } from "@rsi/core";
import { BehaviorSubject } from "rxjs";
import { v4 } from "uuid";
import { ICollectionObject, IRendererElement, IRendererObject } from "../media.types";

export class NetfluxRenderer {
  public readonly subject: BehaviorSubject<IRendererElement>;
  public readonly id = v4();
  private interval: NodeJS.Timer;
  private renderer: IRendererObject;

  private logger: IRsiLoggerInstance = RsiLogger.getInstance().getLogger("media.NetfluxRenderer");

  constructor(private service, private resource, private mediaCollection: ICollectionObject) {
    this.renderer = {
      currentMediaItem: mediaCollection.items[0],
      id: this.id,
      media: mediaCollection,
      name: "Netflux",
      offset: 0,
      repeat: "off",
      shuffle: "off",
      state: "idle",
      uri:
        "/" +
        this.service.name +
        "/" +
        this.resource.name +
        "/" +
        this.id
    };
    this.subject = new BehaviorSubject<IRendererElement>({
      data: this.renderer,
      lastUpdate: Date.now(),
      propertiesChanged: []
    });
  }

  public play() {
    const speed = 1000;
    this.interval = setInterval(() => {
      this.renderer.offset = this.renderer.state === "play" ? this.renderer.offset + speed : this.renderer.offset;
      this.renderer.state = "play";
      this.subject.next({
        data: this.renderer,
        lastUpdate: Date.now(),
        propertiesChanged: ["offset", "state"]
      });
    }, speed);
  }

  public pause() {
    clearInterval(this.interval);
    this.renderer.state = "pause";
    this.subject.next({
      data: this.renderer,
      lastUpdate: Date.now(),
      propertiesChanged: ["state"]
    });
  }

  public stop() {
    clearInterval(this.interval);
    this.renderer.offset = 0;
    this.renderer.state = "stop";
    this.subject.next({
      data: this.renderer,
      lastUpdate: Date.now(),
      propertiesChanged: ["state", "offset"]
    });
  }

}
