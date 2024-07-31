"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.populatePublishedDate = void 0;
var populatePublishedDate = function (_a) {
    var data = _a.data, operation = _a.operation, req = _a.req;
    if (operation === 'create' || operation === 'update') {
        if (req.body && !req.body.publishedDate) {
            var now = new Date();
            return __assign(__assign({}, data), { publishedDate: now });
        }
    }
    return data;
};
exports.populatePublishedDate = populatePublishedDate;
