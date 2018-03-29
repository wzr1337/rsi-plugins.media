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
var collections_1 = require("./collections");
var renderers_1 = require("./renderers");
var Media = /** @class */ (function (_super) {
    __extends(Media, _super);
    function Media() {
        var _this = _super.call(this) || this;
        _this.id = "f9a1073f-e90c-4c56-8368-f4c6bd1d8c96"; // random id
        var collections = new collections_1.Collections(_this);
        _this.resources.push(collections);
        // tslint:disable-next-line:max-line-length
        var initialCollection = collections.elements.filter(function (element) { return element.getValue().data.name === "default"; })[0];
        _this.resources.push(new renderers_1.Renderers(_this, initialCollection.getValue().data));
        return _this;
    }
    return Media;
}(core_1.Service));
exports.Media = Media;
//# sourceMappingURL=media.js.map