"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@rsi/core");
var rxjs_1 = require("rxjs");
var NetfluxRenderer = /** @class */ (function (_super) {
    __extends(NetfluxRenderer, _super);
    // tslint:disable-next-line:max-line-length
    function NetfluxRenderer(service, resource, mediaCollection) {
        var _this = _super.call(this, { data: {
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
        }) || this;
        _this.service = service;
        _this.resource = resource;
        _this.mediaCollection = mediaCollection;
        _this.propertiesChanged = [];
        _this.shuffleMode = "off";
        _this.logger = core_1.RsiLogger.getInstance().getLogger("media.NetfluxRenderer");
        _this.renderer = _this.getValue().data;
        return _this;
    }
    NetfluxRenderer.prototype.play = function () {
        var _this = this;
        var speed = 1000;
        this.interval = setInterval(function () {
            _this.renderer.offset = _this.renderer.state === "play" ? _this.renderer.offset + speed : _this.renderer.offset;
            _this.propertiesChanged.push("offset");
            _this.next();
        }, speed);
        this.renderer.state = "play";
        this.propertiesChanged.push("state");
    };
    NetfluxRenderer.prototype.pause = function () {
        clearInterval(this.interval);
        this.renderer.state = "pause";
        this.propertiesChanged.push("state");
    };
    NetfluxRenderer.prototype.stop = function () {
        clearInterval(this.interval);
        this.renderer.offset = 0;
        this.renderer.state = "stop";
        this.propertiesChanged.push("state");
        this.propertiesChanged.push("offset");
    };
    NetfluxRenderer.prototype.setShuffle = function (mode) {
        this.renderer.shuffle = mode;
        this.propertiesChanged.push("shuffle");
    };
    NetfluxRenderer.prototype.setRepeat = function (mode) {
        this.renderer.repeat = mode;
        this.propertiesChanged.push("repeat");
    };
    NetfluxRenderer.prototype.next = function () {
        _super.prototype.next.call(this, {
            data: this.renderer,
            lastUpdate: Date.now(),
            propertiesChanged: this.propertiesChanged
        });
        this.propertiesChanged = [];
    };
    Object.defineProperty(NetfluxRenderer.prototype, "id", {
        get: function () {
            return this.renderer.id;
        },
        enumerable: true,
        configurable: true
    });
    return NetfluxRenderer;
}(rxjs_1.BehaviorSubject));
exports.NetfluxRenderer = NetfluxRenderer;
//# sourceMappingURL=netflux.js.map