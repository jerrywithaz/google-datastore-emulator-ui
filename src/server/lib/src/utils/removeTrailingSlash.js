"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function removeTrailingSlash(str) {
    if (str.endsWith("/")) {
        return str.slice(0, -1);
    }
    return str;
}
exports.default = removeTrailingSlash;
