import { IElement } from "@rsi/core";

export interface IRendererObject {
  id: string;
  name: string;
  uri: string;
  media?: Object;
  currentMediaItem?: Object;
  offset?: number;
  scan?: "off" | "up" | "down";
  state?: "idle" | "play" | "pause" | "stop" | "ff" | "fr";
  repeat?: "off" | "repeatall" | "repeatone";
  shuffle?: "on" | "off";
  type?: "track" | "video" | "image";
}

export interface ICollectionObject {
  id: string;
  name: string;
  uri: string;
  items?: ItemObject[];
}

export interface ItemObject {
  id: string;
  name: string;
  uri: string;
  collection?: ICollectionObject;
  renderable?: {
    id: string;
    name: string;
    uri: string;
  };
}

export interface IRendererElement extends IElement {
  data: IRendererObject;
}