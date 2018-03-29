"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@rsi/core");
var rxjs_1 = require("rxjs");
var uuid_1 = require("uuid");
var NetfluxRenderer = /** @class */ (function () {
    function NetfluxRenderer(service, resource, mediaCollection) {
        this.service = service;
        this.resource = resource;
        this.mediaCollection = mediaCollection;
        this.id = uuid_1.v4();
        this.logger = core_1.RsiLogger.getInstance().getLogger("media.NetfluxRenderer");
        this.renderer = {
            currentMediaItem: mediaCollection.items[0],
            id: this.id,
            media: mediaCollection,
            name: "Netflux",
            offset: 0,
            repeat: "off",
            shuffle: "off",
            state: "idle",
            uri: "/" +
                this.service.name +
                "/" +
                this.resource.name +
                "/" +
                this.id
        };
        this.subject = new rxjs_1.BehaviorSubject({
            data: this.renderer,
            lastUpdate: Date.now(),
            propertiesChanged: []
        });
    }
    NetfluxRenderer.prototype.play = function () {
        var _this = this;
        var speed = 1000;
        this.interval = setInterval(function () {
            _this.renderer.offset = _this.renderer.state === "play" ? _this.renderer.offset + speed : _this.renderer.offset;
            _this.renderer.state = "play";
            _this.subject.next({
                data: _this.renderer,
                lastUpdate: Date.now(),
                propertiesChanged: ["offset", "state"]
            });
        }, speed);
    };
    NetfluxRenderer.prototype.pause = function () {
        clearInterval(this.interval);
        this.renderer.state = "pause";
        this.subject.next({
            data: this.renderer,
            lastUpdate: Date.now(),
            propertiesChanged: ["state"]
        });
    };
    NetfluxRenderer.prototype.stop = function () {
        clearInterval(this.interval);
        this.renderer.offset = 0;
        this.renderer.state = "stop";
        this.subject.next({
            data: this.renderer,
            lastUpdate: Date.now(),
            propertiesChanged: ["state", "offset"]
        });
    };
    return NetfluxRenderer;
}());
exports.NetfluxRenderer = NetfluxRenderer;
//# sourceMappingURL=netflux.js.map