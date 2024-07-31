"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable react/no-unescaped-entities */
var components_1 = require("payload/components");
var react_1 = __importDefault(require("react"));
require("./index.scss");
var baseClass = 'before-dashboard';
var BeforeDashboard = function () {
    return (react_1.default.createElement("div", { className: baseClass },
        react_1.default.createElement(components_1.Banner, { type: "success" },
            react_1.default.createElement(components_1.Check, null),
            react_1.default.createElement("strong", null, "Payload is completely free and open-source."),
            " If you like what we're doing,",
            ' ',
            react_1.default.createElement("a", { href: "https://github.com/payloadcms/payload", rel: "noreferrer", target: "_blank" }, "leave us a star on GitHub!"))));
};
exports.default = BeforeDashboard;
