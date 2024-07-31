"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var format = function (val) {
    return val
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
        .toLowerCase();
};
var formatSlug = function (fallback) {
    return function (_a) {
        var data = _a.data, operation = _a.operation, originalDoc = _a.originalDoc, value = _a.value;
        if (typeof value === 'string') {
            return format(value);
        }
        if (operation === 'create') {
            var fallbackData = (data === null || data === void 0 ? void 0 : data[fallback]) || (originalDoc === null || originalDoc === void 0 ? void 0 : originalDoc[fallback]);
            if (fallbackData && typeof fallbackData === 'string') {
                return format(fallbackData);
            }
        }
        return value;
    };
};
exports.default = formatSlug;
