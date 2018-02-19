"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var media_1 = require("./media");
exports.Media = media_1.Media;
var medialibrary_1 = require("./medialibrary");
exports.Medialibrary = medialibrary_1.Medialibrary;
var getPlugins = function () {
    return [medialibrary_1.Medialibrary, media_1.Media];
};
exports.getPlugins = getPlugins;
//# sourceMappingURL=index.js.map