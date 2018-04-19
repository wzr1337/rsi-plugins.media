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
var fs = require("fs");
var path = require("path");
var core_1 = require("@rsi/core");
var rxjs_1 = require("rxjs");
var cdn_1 = require("@rsi/cdn");
var Tracks = /** @class */ (function (_super) {
    __extends(Tracks, _super);
    function Tracks(service) {
        var _this = _super.call(this, service) || this;
        _this.logger = core_1.RsiLogger.getInstance().getLogger("medialibrary.Tracks");
        var dataPath = path.join(__dirname, "..", "..", "data");
        var mocks = JSON.parse(fs.readFileSync(path.join(dataPath, "mocks.json")).toString());
        var _loop_1 = function (idx) {
            if (mocks.tracks.hasOwnProperty(idx)) {
                var track_1 = mocks.tracks[idx];
                cdn_1.Cdn.getInstance().register("images", path.basename(track_1.image), function () {
                    return fs.readFileSync(path.join(dataPath, track_1.image));
                });
                var trackObject = new rxjs_1.BehaviorSubject({
                    data: Object.assign({
                        uri: "/" +
                            this_1.service.name +
                            "/" +
                            this_1.name +
                            "/" +
                            track_1.id
                    }, track_1),
                    lastUpdate: Date.now(),
                    propertiesChanged: []
                });
                this_1.addElement(trackObject);
            }
        };
        var this_1 = this;
        for (var idx in mocks.tracks) {
            _loop_1(idx);
        }
        _this._change = new rxjs_1.BehaviorSubject({ lastUpdate: Date.now(), action: "init" });
        return _this;
    }
    Object.defineProperty(Tracks.prototype, "elementSubscribable", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    return Tracks;
}(core_1.Resource));
exports.Tracks = Tracks;
//# sourceMappingURL=tracks.js.map