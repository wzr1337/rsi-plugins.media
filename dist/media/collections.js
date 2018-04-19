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
var uuid_1 = require("uuid");
var core_1 = require("@rsi/core");
var medialibrary_1 = require("../medialibrary");
var Collections = /** @class */ (function (_super) {
    __extends(Collections, _super);
    function Collections(service) {
        var _this = _super.call(this, service) || this;
        _this.logger = core_1.RsiLogger.getInstance().getLogger("media.Collections");
        var collectionId = "deadbeef-d2c1-11e6-9376-df943f51f0d8";
        _this.medialibrary = medialibrary_1.Medialibrary.getInstance();
        _this.tracks = _this.medialibrary.getResource("tracks");
        var items = _this.tracks.elements[0] ? [_this.tracks.elements[0].getValue().data] : [];
        var initialCollection = new rxjs_1.BehaviorSubject({
            data: {
                id: collectionId,
                items: items,
                name: "default",
                uri: "/" +
                    _this.service.name +
                    "/" +
                    _this.name +
                    "/" +
                    collectionId
            },
            lastUpdate: Date.now(),
            propertiesChanged: []
        });
        _this.addElement(initialCollection);
        _this._change = new rxjs_1.BehaviorSubject({ lastUpdate: Date.now(), action: "init" });
        return _this;
    }
    Object.defineProperty(Collections.prototype, "name", {
        get: function () {
            return this.constructor.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Collections.prototype, "elementSubscribable", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Collections.prototype, "resourceSubscribable", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Collections.prototype.createElement = function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var collectionId, items, newCollection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!state.name) {
                            return [2 /*return*/, {
                                    code: core_1.StatusCode.INTERNAL_SERVER_ERROR,
                                    error: new Error("providing a name is mandatory"),
                                    status: "error"
                                }];
                        }
                        collectionId = uuid_1.v1();
                        items = [];
                        if (!state.hasOwnProperty("items")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._setItems(state.items)];
                    case 1:
                        items = _a.sent();
                        if (!Array.isArray(items)) {
                            return [2 /*return*/, items];
                        }
                        _a.label = 2;
                    case 2:
                        newCollection = new rxjs_1.BehaviorSubject({
                            data: {
                                id: collectionId,
                                items: items,
                                name: state.name,
                                uri: "/" +
                                    this.service.name +
                                    "/" +
                                    this.name +
                                    "/" +
                                    collectionId
                            },
                            lastUpdate: Date.now(),
                            propertiesChanged: []
                        });
                        this.addElement(newCollection);
                        /** publish a resource change */
                        this._change.next({ lastUpdate: Date.now(), action: "add" });
                        /** return success */
                        return [2 /*return*/, { status: "ok", data: newCollection }];
                }
            });
        });
    };
    Collections.prototype.updateElement = function (elementId, difference) {
        return __awaiter(this, void 0, void 0, function () {
            var element, collection, propertiesChanged, newItems;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getElement(elementId)];
                    case 1:
                        element = (_a.sent()).data;
                        collection = element.getValue();
                        propertiesChanged = [];
                        if (!difference.hasOwnProperty("items")) return [3 /*break*/, 3];
                        return [4 /*yield*/, this._setItems(difference.items)];
                    case 2:
                        newItems = _a.sent();
                        if (!Array.isArray(newItems)) {
                            return [2 /*return*/, newItems];
                        }
                        collection.data.items = newItems;
                        collection.lastUpdate = Date.now();
                        collection.propertiesChanged = ["items"];
                        element.next(collection);
                        return [2 /*return*/, { status: "ok" }];
                    case 3: return [2 /*return*/, { status: "error", code: 400, message: "No actions to take.." }];
                }
            });
        });
    };
    Collections.prototype.deleteElement = function (elementId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.removeElement(elementId)) {
                    return [2 /*return*/, { status: "ok" }];
                }
                return [2 /*return*/, { status: "error", code: 404, message: "Element can not be found" }];
            });
        });
    };
    Collections.prototype._setItems = function (itemuris) {
        return __awaiter(this, void 0, void 0, function () {
            var items, regex, errors, _a, _b, _i, index, uri, match, id, track;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        items = [];
                        regex = /[\w\/\:]*([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fAF]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
                        errors = [];
                        if (!this.tracks) return [3 /*break*/, 6];
                        _a = [];
                        for (_b in itemuris)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        index = _a[_i];
                        if (!(index && itemuris[index])) return [3 /*break*/, 4];
                        uri = itemuris[index];
                        match = uri.match(regex);
                        if (!(match !== null)) return [3 /*break*/, 4];
                        id = match[1];
                        if (!!id) return [3 /*break*/, 2];
                        errors.push("Id " + id + "not valid from uri: " + uri);
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.tracks.getElement(id)];
                    case 3:
                        track = _c.sent();
                        if (track && track.data) {
                            items.push(track.data.getValue().data);
                        }
                        else {
                            errors.push("Track " + id + " can not be found");
                        }
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5:
                        if (errors.length !== 0) {
                            return [2 /*return*/, { status: "error", error: new Error(errors.join(",")), code: 400 }];
                        }
                        return [3 /*break*/, 7];
                    case 6: return [2 /*return*/, { status: "error", error: new Error("No tracks loaded..."), code: 500 }];
                    case 7: return [2 /*return*/, items];
                }
            });
        });
    };
    return Collections;
}(core_1.Resource));
exports.Collections = Collections;
//# sourceMappingURL=collections.js.map