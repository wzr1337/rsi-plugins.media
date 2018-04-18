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
var Tracks = /** @class */ (function (_super) {
    __extends(Tracks, _super);
    // private _logger = RsiLogger.getInstance().getLogger("media");
    function Tracks(service) {
        var _this = _super.call(this, service) || this;
        var mocksPath = path.join(__dirname, "..", "..", "data", "mocks.json");
        var mocks = JSON.parse(fs.readFileSync(mocksPath).toString());
        for (var idx in mocks.tracks) {
            if (mocks.tracks.hasOwnProperty(idx)) {
                var track = mocks.tracks[idx];
                var trackObject = new rxjs_1.BehaviorSubject({
                    data: Object.assign({
                        uri: "/" +
                            _this.service.name +
                            "/" +
                            _this.name +
                            "/" +
                            track.id
                    }, track),
                    lastUpdate: Date.now(),
                    propertiesChanged: []
                });
                _this.addElement(trackObject);
            }
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