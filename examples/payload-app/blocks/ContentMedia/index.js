"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentMedia = void 0;
var invertBackground_1 = require("../../fields/invertBackground");
var richText_1 = __importDefault(require("../../fields/richText"));
exports.ContentMedia = {
    fields: [
        invertBackground_1.invertBackground,
        {
            name: 'mediaPosition',
            options: [
                {
                    label: 'Left',
                    value: 'left',
                },
                {
                    label: 'Right',
                    value: 'right',
                },
            ],
            type: 'radio',
        },
        (0, richText_1.default)(),
        {
            name: 'media',
            relationTo: 'media',
            required: true,
            type: 'upload',
        },
    ],
    slug: 'contentMedia',
};
