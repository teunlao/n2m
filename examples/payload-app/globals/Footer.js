"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Footer = void 0;
var link_1 = __importDefault(require("../fields/link"));
exports.Footer = {
    access: {
        read: function () { return true; },
    },
    fields: [
        {
            name: 'navItems',
            fields: [
                (0, link_1.default)({
                    appearances: false,
                }),
            ],
            maxRows: 6,
            type: 'array',
        },
    ],
    slug: 'footer',
};
