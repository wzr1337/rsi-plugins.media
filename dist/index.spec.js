"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
describe("general", function () {
    it("should be true", function (done) {
        expect(1).toBeTruthy();
        done();
    });
    it("should return a list of services ", function () {
        expect(Array.isArray(index_1.getPlugins())).toBeTruthy();
    });
});
//# sourceMappingURL=index.spec.js.map