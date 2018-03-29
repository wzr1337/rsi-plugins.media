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
var core_1 = require("@rsi/core");
var Renderers = /** @class */ (function (_super) {
    __extends(Renderers, _super);
    function Renderers(service, initialCollection) {
        var _this = _super.call(this, service) || this;
        _this.id = "d6ebfd90-d2c1-11e6-9376-df943f51f0d8"; // uuid.v1();  // FIXED for now
        _this.renderers = [];
        _this.logger = core_1.RsiLogger.getInstance().getLogger("media.Renderers");
        console.log(initialCollection);
        var netfluxRenderer = new rxjs_1.BehaviorSubject({
            data: {
                id: _this.id,
                media: initialCollection,
                name: "Netflux",
                offset: 0,
                repeat: "off",
                shuffle: "off",
                state: "idle",
                uri: "/" +
                    _this.service.name +
                    "/" +
                    _this.name +
                    "/" +
                    _this.id
            },
            lastUpdate: Date.now(),
            propertiesChanged: []
        });
        _this.renderers.push(netfluxRenderer);
        _this._change = new rxjs_1.BehaviorSubject({
            action: "init",
            lastUpdate: Date.now()
        });
        return _this;
    }
    Object.defineProperty(Renderers.prototype, "elementSubscribable", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Renderers.prototype, "elements", {
        get: function () {
            return this.renderers;
        },
        enumerable: true,
        configurable: true
    });
    Renderers.prototype.getElement = function (elementId) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                data = this.renderers.find(function (element) {
                    if (element) {
                        return element.getValue().data.id === elementId;
                    }
                    return undefined;
                });
                return [2 /*return*/, data ? { data: data, status: "ok" } : undefined];
            });
        });
    };
    Renderers.prototype.getResource = function (offset, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var resp;
            return __generator(this, function (_a) {
                if ((typeof offset === "number" && typeof limit === "number") ||
                    (typeof limit === "number" && !offset) ||
                    (typeof offset === "number" && !limit) ||
                    (!offset && !limit)) {
                    resp = this.renderers.slice(offset, limit);
                }
                return [2 /*return*/, { status: "ok", data: resp }];
            });
        });
    };
    Renderers.prototype.updateElement = function (elementId, difference) {
        return __awaiter(this, void 0, void 0, function () {
            var element, renderer, propertiesChanged, speed_1, resp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getElement(elementId)];
                    case 1:
                        element = (_a.sent()).data;
                        renderer = element.getValue().data;
                        propertiesChanged = [];
                        if (difference.hasOwnProperty("state")) {
                            renderer.state = difference.state;
                            switch (difference.state) {
                                case "play":
                                    switch (renderer.id) {
                                        // mock player requested
                                        case this.id:
                                            speed_1 = 1000;
                                            this.interval = setInterval(function () {
                                                renderer.offset = renderer.hasOwnProperty("offset") ? renderer.offset + speed_1 : 0;
                                                element.next({
                                                    data: renderer,
                                                    lastUpdate: Date.now(),
                                                    propertiesChanged: ["offset"]
                                                });
                                            }, speed_1);
                                            break;
                                        default:
                                            return [2 /*return*/, { status: "error", error: new Error("Renderer not found"), code: 404 }];
                                    }
                                    break;
                                default:
                                    switch (renderer.id) {
                                        // mock player requested
                                        case this.id:
                                            clearInterval(this.interval);
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
                        resp = { data: renderer, lastUpdate: Date.now(), propertiesChanged: propertiesChanged };
                        element.next(resp); // @TODO: check diffs bevor updating without a need
                        return [2 /*return*/, { status: "ok" }];
                }
            });
        });
    };
    return Renderers;
}(core_1.Resource));
exports.Renderers = Renderers;
//# sourceMappingURL=renderers.js.map