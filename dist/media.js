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
var rxjs_1 = require("rxjs");
var uuid = require("uuid");
var core_1 = require("@rsi/core");
var _1 = require("./");
var Media = /** @class */ (function (_super) {
    __extends(Media, _super);
    function Media() {
        var _this = _super.call(this) || this;
        _this.id = "f9a1073f-e90c-4c56-8368-f4c6bd1d8c96"; //random id
        _this.resources.push(new Renderers(_this));
        _this.resources.push(new Collections(_this));
        return _this;
    }
    return Media;
}(core_1.Service));
exports.Media = Media;
var Renderers = /** @class */ (function () {
    function Renderers(service) {
        this.service = service;
        this._renderers = [];
        this._logger = core_1.rsiLogger.getInstance().getLogger("media.Renderers");
        //let collections = service.resources.filter<Collections>(resource => resource.name === "collections");
        //const initialCollection = collections.map( element => element.name === "default");
        var netfluxRenderer = new rxjs_1.BehaviorSubject({
            lastUpdate: Date.now(),
            propertiesChanged: [],
            data: {
                uri: "/" + this.service.name.toLowerCase() + "/" + this.name.toLowerCase() + "/" + Renderers.netfluxRendererId,
                id: Renderers.netfluxRendererId,
                name: "Netflux",
                state: "idle",
                shuffle: "off",
                repeat: "off",
                offset: 0,
                media: "initialCollection"
            }
        });
        this._renderers.push(netfluxRenderer);
        this._change = new rxjs_1.BehaviorSubject({ lastUpdate: Date.now(), action: 'init' });
    }
    Object.defineProperty(Renderers.prototype, "name", {
        get: function () {
            return this.constructor.name;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Renderers.prototype, "elementSubscribable", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Renderers.prototype, "change", {
        get: function () {
            return this._change;
        },
        enumerable: true,
        configurable: true
    });
    Renderers.prototype.getElement = function (elementId) {
        // find the element requested by the client
        var data = this._renderers.find(function (element) {
            if (element)
                return element.getValue().data.id === elementId;
            return undefined;
        });
        return data ? {
            status: "ok",
            data: data
        } : undefined;
    };
    ;
    Renderers.prototype.getResource = function (offset, limit) {
        // retriev all element
        var resp;
        if ((typeof offset === "number" && typeof limit === "number") || (typeof limit === "number" && !offset) || (typeof offset === "number" && !limit) || (!offset && !limit)) {
            resp = this._renderers.slice(offset, limit);
        }
        return { status: "ok", data: resp };
    };
    ;
    Renderers.prototype.updateElement = function (elementId, difference) {
        var element = this.getElement(elementId).data;
        var renderer = element.getValue().data;
        var propertiesChanged = [];
        if (difference.hasOwnProperty("state")) {
            renderer.state = difference.state;
            switch (difference.state) {
                case "play":
                    if (renderer.id === Renderers.netfluxRendererId) {
                        var speed_1 = 1000;
                        this._interval = setInterval(function () {
                            renderer.offset = renderer.hasOwnProperty("offset") ? renderer.offset + speed_1 : 0;
                            element.next({
                                lastUpdate: Date.now(),
                                propertiesChanged: ["offset"],
                                data: renderer
                            });
                        }, speed_1);
                    }
                    break;
                default:
                    switch (renderer.id) {
                        // mock player requested
                        case Renderers.netfluxRendererId:
                            clearInterval(this._interval);
                            break;
                        default:
                            return { status: "error", error: new Error("Renderer not found"), code: 404 };
                    }
                    break;
            }
            propertiesChanged.push("state");
        }
        if (difference.hasOwnProperty("shuffle")) {
            if (-1 !== ["off", "on"].indexOf(difference.shuffle)) {
                renderer.shuffle = difference.shuffle;
                propertiesChanged.push("shuffle");
            }
        }
        if (difference.hasOwnProperty("repeat")) {
            if (-1 !== ["off", "one", "all"].indexOf(difference.repeat)) {
                renderer.repeat = difference.repeat;
                propertiesChanged.push("repeat");
            }
        }
        var resp = {
            lastUpdate: Date.now(),
            propertiesChanged: propertiesChanged,
            data: renderer
        };
        element.next(resp); // @TODO: check diffs bevor updating without a need
        return { status: "ok" };
    };
    Renderers.netfluxRendererId = "d6ebfd90-d2c1-11e6-9376-df943f51f0d8"; //uuid.v1();  // FIXED for now
    return Renderers;
}());
exports.Renderers = Renderers;
var Collections = /** @class */ (function () {
    function Collections(service) {
        this.service = service;
        this._collections = [];
        this._logger = core_1.rsiLogger.getInstance().getLogger("media.Collections");
        var collectionId = "deadbeef-d2c1-11e6-9376-df943f51f0d8";
        var initialCollection = new rxjs_1.BehaviorSubject({
            lastUpdate: Date.now(),
            propertiesChanged: [],
            data: {
                uri: "/" + this.service.name.toLowerCase() + "/" + this.name.toLowerCase() + "/" + collectionId,
                id: collectionId,
                name: "default",
                items: []
            }
        });
        this._collections.push(initialCollection);
        this._change = new rxjs_1.BehaviorSubject({ lastUpdate: Date.now(), action: 'init' });
        this._medialibrary = new _1.Medialibrary();
        this._tracks = this._medialibrary.getResource("Tracks");
    }
    Object.defineProperty(Collections.prototype, "name", {
        get: function () {
            return this.constructor.name;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Collections.prototype, "elementSubscribable", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Collections.prototype, "resourceSubscribable", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Collections.prototype, "change", {
        get: function () {
            return this._change;
        },
        enumerable: true,
        configurable: true
    });
    Collections.prototype._setItems = function (itemuris) {
        var _items = [];
        var regex = /[\w\/\:]*([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fAF]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
        var errors = [];
        if (this._tracks) {
            for (var index in itemuris) {
                var uri = itemuris[index];
                var match = uri.match(regex);
                if (match !== null) {
                    var id = match[1];
                    if (!id) {
                        errors.push("Id " + id + "not valid from uri: " + uri);
                    }
                    else {
                        var track = this._tracks.getElement(id);
                        if (track && track.data) {
                            _items.push(track.data.getValue().data);
                        }
                        else {
                            errors.push("Track " + id + " can not be found");
                        }
                    }
                }
            }
            if (errors.length != 0) {
                return { status: "error", error: new Error(errors.join(",")), code: 400 };
            }
        }
        else {
            return { status: "error", error: new Error("No tracks loaded..."), code: 500 };
        }
        return _items;
    };
    Collections.prototype.getElement = function (elementId) {
        // find the element requested by the client
        return {
            status: "ok",
            data: this._collections.find(function (element) {
                return element.getValue().data.id === elementId;
            })
        };
    };
    ;
    Collections.prototype.createElement = function (state) {
        if (!state.name)
            return {
                status: "error",
                error: new Error('providing a name is mandatory'),
                code: core_1.StatusCode.INTERNAL_SERVER_ERROR
            };
        var collectionId = uuid.v1();
        var items = [];
        /** add items given with the query */
        if (state.hasOwnProperty('items')) {
            items = this._setItems(state.items);
            if (!Array.isArray(items))
                return items;
        }
        /** build the actual media collection and add it to the collections*/
        var newCollection = new rxjs_1.BehaviorSubject({
            lastUpdate: Date.now(),
            propertiesChanged: [],
            data: {
                uri: "/" + this.service.name.toLowerCase() + "/" + this.name.toLowerCase() + "/" + collectionId,
                id: collectionId,
                name: state.name,
                items: items
            }
        });
        this._collections.push(newCollection);
        /** publish a resource change */
        this._change.next({ lastUpdate: Date.now(), action: "add" });
        /** return success */
        return { status: "ok", data: newCollection };
    };
    ;
    Collections.prototype.updateElement = function (elementId, difference) {
        var element = this.getElement(elementId).data;
        var collection = element.getValue();
        var propertiesChanged = [];
        if (difference.hasOwnProperty('items')) {
            var newItems = this._setItems(difference.items);
            if (!Array.isArray(newItems))
                return newItems;
            collection.data.items = newItems;
            collection.lastUpdate = Date.now();
            collection.propertiesChanged = ['items'];
            element.next(collection);
            return { status: "ok" };
        }
        return { status: "error", code: 400, message: "No actions to take.." };
    };
    Collections.prototype.deleteElement = function (elementId) {
        var idx = this._collections.findIndex(function (element, index) {
            return element.getValue().data.id === elementId;
        });
        if (-1 !== idx) {
            this._collections.splice(idx, 1); //remove one item from the collections array
            return { status: "ok" };
        }
        return { status: "error", code: 404, message: "Element can not be found" };
    };
    Collections.prototype.getResource = function (offset, limit) {
        // retriev all element
        var resp;
        if ((typeof offset === "number" && typeof limit === "number") || (typeof limit === "number" && !offset) || (typeof offset === "number" && !limit) || (!offset && !limit)) {
            resp = this._collections.slice(offset, limit);
        }
        return { status: "ok", data: resp };
    };
    ;
    return Collections;
}());
exports.Collections = Collections;
//# sourceMappingURL=media.js.map