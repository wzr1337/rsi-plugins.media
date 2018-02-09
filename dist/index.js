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
var path = require("path");
var fs = require("fs");
var core_1 = require("@rsi/core");
var core_2 = require("@rsi/core");
var server_1 = require("@rsi/server");
var media_1 = require("./media");
exports.Media = media_1.Media;
var Medialibrary = /** @class */ (function (_super) {
    __extends(Medialibrary, _super);
    function Medialibrary() {
        var _this = _super.call(this) || this;
        _this.id = "ea65d5eb-d5fb-4ceb-a568-ed24fcf37e20"; //random id
        _this.resources.push(new Tracks(_this));
        var cnd = server_1.Cdn.getInstance();
        cnd.register('images', 'RLA6JMJK_normal.jpg', function (image) {
            core_1.rsiLogger.getInstance().getLogger("cdn.callback").log('debug', "Looking for " + image);
            var img;
            var data = "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";
            // from base64 string
            img = Buffer.from(data, 'base64');
            return img;
        });
        return _this;
    }
    return Medialibrary;
}(core_2.Service));
exports.Medialibrary = Medialibrary;
var Tracks = /** @class */ (function () {
    //private _logger = rsiLogger.getInstance().getLogger("media");
    function Tracks(service) {
        this.service = service;
        this._tracks = [];
        var mocksPath = path.join(__dirname, "..", "data", "mocks.json");
        var mocks = JSON.parse(fs.readFileSync(mocksPath).toString());
        for (var idx in mocks.tracks) {
            if (mocks.tracks.hasOwnProperty(idx)) {
                var track = mocks.tracks[idx];
                var trackObject = new rxjs_1.BehaviorSubject({
                    lastUpdate: Date.now(),
                    propertiesChanged: [],
                    data: Object.assign({
                        uri: "/" + this.service.name.toLowerCase() + "/" + this.name.toLowerCase() + "/" + track.id
                    }, track)
                });
                this._tracks.push(trackObject);
            }
        }
        this._change = new rxjs_1.BehaviorSubject({ lastUpdate: Date.now(), action: 'init' });
    }
    Object.defineProperty(Tracks.prototype, "name", {
        get: function () {
            return this.constructor.name;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Tracks.prototype, "elementSubscribable", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Tracks.prototype, "change", {
        get: function () {
            return this._change;
        },
        enumerable: true,
        configurable: true
    });
    Tracks.prototype.getElement = function (elementId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // find the element requested by the client
                return [2 /*return*/, {
                        status: "ok",
                        data: this._tracks.find(function (element) {
                            return element.getValue().data.id === elementId;
                        })
                    }];
            });
        });
    };
    ;
    Tracks.prototype.getResource = function (offset, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var resp;
            return __generator(this, function (_a) {
                if ((typeof offset === "number" && typeof limit === "number") || (typeof limit === "number" && !offset) || (typeof offset === "number" && !limit) || (!offset && !limit)) {
                    resp = this._tracks.slice(offset, limit);
                }
                return [2 /*return*/, { status: "ok", data: resp }];
            });
        });
    };
    ;
    return Tracks;
}());
exports.Tracks = Tracks;
var getPlugins = function () {
    return [Medialibrary, media_1.Media];
};
exports.getPlugins = getPlugins;
//# sourceMappingURL=index.js.map