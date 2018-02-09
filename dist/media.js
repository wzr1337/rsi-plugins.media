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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                data = this._renderers.find(function (element) {
                    if (element)
                        return element.getValue().data.id === elementId;
                    return undefined;
                });
                return [2 /*return*/, data ? {
                        status: "ok",
                        data: data
                    } : undefined];
            });
        });
    };
    ;
    Renderers.prototype.getResource = function (offset, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var resp;
            return __generator(this, function (_a) {
                if ((typeof offset === "number" && typeof limit === "number") || (typeof limit === "number" && !offset) || (typeof offset === "number" && !limit) || (!offset && !limit)) {
                    resp = this._renderers.slice(offset, limit);
                }
                return [2 /*return*/, { status: "ok", data: resp }];
            });
        });
    };
    ;
    Renderers.prototype.updateElement = function (elementId, difference) {
        return __awaiter(this, void 0, void 0, function () {
            var elementResponse, element, renderer, propertiesChanged, speed_1, resp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getElement(elementId)];
                    case 1:
                        elementResponse = _a.sent();
                        element = elementResponse.data;
                        renderer = element.getValue().data;
                        propertiesChanged = [];
                        if (difference.hasOwnProperty("state")) {
                            renderer.state = difference.state;
                            switch (difference.state) {
                                case "play":
                                    if (renderer.id === Renderers.netfluxRendererId) {
                                        speed_1 = 1000;
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
                                            return [2 /*return*/, { status: "error", error: new Error("Renderer not found"), code: 404 }];
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
                        resp = {
                            lastUpdate: Date.now(),
                            propertiesChanged: propertiesChanged,
                            data: renderer
                        };
                        element.next(resp); // @TODO: check diffs bevor updating without a need
                        return [2 /*return*/, { status: "ok" }];
                }
            });
        });
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
        return __awaiter(this, void 0, void 0, function () {
            var _items, regex, errors, _a, _b, _i, index, uri, match, id, track;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _items = [];
                        regex = /[\w\/\:]*([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fAF]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
                        errors = [];
                        if (!this._tracks) return [3 /*break*/, 6];
                        _a = [];
                        for (_b in itemuris)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        index = _a[_i];
                        uri = itemuris[index];
                        match = uri.match(regex);
                        if (!(match !== null)) return [3 /*break*/, 4];
                        id = match[1];
                        if (!!id) return [3 /*break*/, 2];
                        errors.push("Id " + id + "not valid from uri: " + uri);
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this._tracks.getElement(id)];
                    case 3:
                        track = _c.sent();
                        if (track && track.data) {
                            _items.push(track.data.getValue().data);
                        }
                        else {
                            errors.push("Track " + id + " can not be found");
                        }
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5:
                        if (errors.length != 0) {
                            return [2 /*return*/, { status: "error", error: new Error(errors.join(",")), code: 400 }];
                        }
                        return [3 /*break*/, 7];
                    case 6: return [2 /*return*/, { status: "error", error: new Error("No tracks loaded..."), code: 500 }];
                    case 7: return [2 /*return*/, _items];
                }
            });
        });
    };
    Collections.prototype.getElement = function (elementId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // find the element requested by the client
                return [2 /*return*/, {
                        status: "ok",
                        data: this._collections.find(function (element) {
                            return element.getValue().data.id === elementId;
                        })
                    }];
            });
        });
    };
    ;
    Collections.prototype.createElement = function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var collectionId, items, newCollection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!state.name)
                            return [2 /*return*/, {
                                    status: "error",
                                    error: new Error('providing a name is mandatory'),
                                    code: core_1.StatusCode.INTERNAL_SERVER_ERROR
                                }];
                        collectionId = uuid.v1();
                        items = [];
                        if (!state.hasOwnProperty('items')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._setItems(state.items)];
                    case 1:
                        items = _a.sent();
                        if (!Array.isArray(items))
                            return [2 /*return*/, items];
                        _a.label = 2;
                    case 2:
                        newCollection = new rxjs_1.BehaviorSubject({
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
                        return [2 /*return*/, { status: "ok", data: newCollection }];
                }
            });
        });
    };
    ;
    Collections.prototype.updateElement = function (elementId, difference) {
        return __awaiter(this, void 0, void 0, function () {
            var elementResponse, element, collection, propertiesChanged, newItems;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getElement(elementId)];
                    case 1:
                        elementResponse = _a.sent();
                        return [4 /*yield*/, elementResponse.data];
                    case 2:
                        element = _a.sent();
                        collection = element.getValue();
                        propertiesChanged = [];
                        if (!difference.hasOwnProperty('items')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this._setItems(difference.items)];
                    case 3:
                        newItems = _a.sent();
                        if (!Array.isArray(newItems))
                            return [2 /*return*/, newItems];
                        collection.data.items = newItems;
                        collection.lastUpdate = Date.now();
                        collection.propertiesChanged = ['items'];
                        element.next(collection);
                        return [2 /*return*/, { status: "ok" }];
                    case 4: return [2 /*return*/, { status: "error", code: 400, message: "No actions to take.." }];
                }
            });
        });
    };
    Collections.prototype.deleteElement = function (elementId) {
        return __awaiter(this, void 0, void 0, function () {
            var idx;
            return __generator(this, function (_a) {
                idx = this._collections.findIndex(function (element, index) {
                    return element.getValue().data.id === elementId;
                });
                if (-1 !== idx) {
                    this._collections.splice(idx, 1); //remove one item from the collections array
                    return [2 /*return*/, { status: "ok" }];
                }
                return [2 /*return*/, { status: "error", code: 404, message: "Element can not be found" }];
            });
        });
    };
    Collections.prototype.getResource = function (offset, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var resp;
            return __generator(this, function (_a) {
                if ((typeof offset === "number" && typeof limit === "number") || (typeof limit === "number" && !offset) || (typeof offset === "number" && !limit) || (!offset && !limit)) {
                    resp = this._collections.slice(offset, limit);
                }
                return [2 /*return*/, { status: "ok", data: resp }];
            });
        });
    };
    ;
    return Collections;
}());
exports.Collections = Collections;
//# sourceMappingURL=media.js.map