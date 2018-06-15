"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@rsi/core");
var _1 = require(".");
beforeAll(function () {
    core_1.RsiLogger.getInstance().getLogger("cdn").level = "error"; // disbale cdn silly logs
});
describe("Media", function () {
    it("should have an id", function () {
        var media = _1.Media.getInstance();
        expect(media.id).toBeDefined();
    });
});
//# sourceMappingURL=index.spec.js.map