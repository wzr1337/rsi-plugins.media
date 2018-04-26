"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@rsi/core");
var _1 = require(".");
beforeAll(function () {
    core_1.RsiLogger.getInstance().getLogger("cdn").level = "error"; // disbale cdn silly logs
});
describe("Medialibrary", function () {
    it("should have an id", function () {
        var ml = _1.Medialibrary.getInstance();
        expect(ml.id).toBeDefined();
    });
    it("should have resources", function () {
        var ml = _1.Medialibrary.getInstance();
        expect(ml.resources).toBeDefined();
        expect(Array.isArray(ml.resources)).toBeTruthy();
    });
    it("should host a Tracks resource", function () {
        var ml = _1.Medialibrary.getInstance();
        var res = ml.resources.find(function (element) { return element.name.toLowerCase() === "tracks"; });
        expect(res).toBeDefined();
    });
});
//# sourceMappingURL=index.spec.js.map