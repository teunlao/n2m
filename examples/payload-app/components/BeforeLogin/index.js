"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var BeforeLogin = function () {
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("p", null,
            "To log in, use the email ",
            react_1.default.createElement("strong", null, "demo@payloadcms.com"),
            " with the password",
            ' ',
            react_1.default.createElement("strong", null, "demo"),
            ". This demo CMS will reset every hour."),
        react_1.default.createElement("p", null,
            "The code for this demo is open source and can be found",
            ' ',
            react_1.default.createElement("a", { href: "https://github.com/payloadcms/public-demo", rel: "noopener noreferrer", target: "_blank" }, "here"),
            ".")));
};
exports.default = BeforeLogin;
