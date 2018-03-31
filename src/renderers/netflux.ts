import { IRsiLoggerInstance, RsiLogger } from "@rsi/core";
import { BehaviorSubject } from "rxjs";
import { ICollectionObject, IRendererElement, IRendererObject } from "../media.types";

export class NetfluxRenderer extends BehaviorSubject<IRendererElement> {
  private interval: NodeJS.Timer;
  private renderer: IRendererObject;
  private propertiesChanged: string[] = [];
  private shuffleMode: "on" | "off" = "off";

  private logger: IRsiLoggerInstance = RsiLogger.getInstance().getLogger("media.NetfluxRenderer");

  // tslint:disable-next-line:max-line-length
  constructor(private service, private resource, private mediaCollection: ICollectionObject) {
    super({data: {
      currentMediaItem: mediaCollection.items[0],
      id: "d6ebfd90-d2c1-11e6-9376-df943f51f0d8",
      media: mediaCollection,
      name: "Netflux",
      offset: 0,
      repeat: "off",
      shuffle: "off",
      state: "idle",
      uri: "/" + service.name + "/" + resource.name + "/" + "d6ebfd90-d2c1-11e6-9376-df943f51f0d8"
    },
      lastUpdate: Date.now(),
      propertiesChanged: []
    });
    this.renderer = this.getValue().data;
  }

  public play() {
    const speed = 1000;
    this.interval = setInterval(() => {
      this.renderer.offset = this.renderer.state === "play" ? this.renderer.offset + speed : this.renderer.offset;
      this.propertiesChanged.push("offset");
      this.next();
    }, speed);
    this.renderer.state = "play";
    this.propertiesChanged.push("state");
  }

  public pause() {
    clearInterval(this.interval);
    this.renderer.state = "pause";
    this.propertiesChanged.push("state");
  }

  public stop() {
    clearInterval(this.interval);
    this.renderer.offset = 0;
    this.renderer.state = "stop";
    this.propertiesChanged.push("state");
    this.propertiesChanged.push("offset");
  }

  public setShuffle(mode: "on" | "off", ) {
    this.renderer.shuffle = mode;
    this.propertiesChanged.push("shuffle");
  }

  public setRepeat(mode: "off" | "repeatall" | "repeatone", ) {
    this.renderer.repeat = mode;
    this.propertiesChanged.push("repeat");
  }

  public next() {
    super.next({
      data: this.renderer,
      lastUpdate: Date.now(),
      propertiesChanged: this.propertiesChanged
    });
    this.propertiesChanged = [];
  }

  get id(): string {
    return this.renderer.id;
  }
}
