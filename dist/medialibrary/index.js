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
var tracks_1 = require("./tracks");
exports.Tracks = tracks_1.Tracks;
var Medialibrary = /** @class */ (function (_super) {
    __extends(Medialibrary, _super);
    function Medialibrary() {
        var _this = _super.call(this) || this;
        _this.id = "ea65d5eb-d5fb-4ceb-a568-ed24fcf37e20"; // random id
        _this.resources.push(new tracks_1.Tracks(_this));
        return _this;
    }
    return Medialibrary;
}(core_1.Service));
exports.Medialibrary = Medialibrary;
//# sourceMappingURL=index.js.map