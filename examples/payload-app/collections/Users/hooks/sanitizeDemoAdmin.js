"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeDemoAdmin = void 0;
var shared_1 = require("../../../cron/shared");
var sanitizeDemoAdmin = function (_a) {
    var args = _a.args, operation = _a.operation;
    if (operation === 'update') {
        if (args.data &&
            'email' in args.data &&
            'password' in args.data &&
            args.req.user.email === shared_1.adminEmail) {
            args.data.password = shared_1.adminPassword;
        }
    }
    return args;
};
exports.sanitizeDemoAdmin = sanitizeDemoAdmin;
