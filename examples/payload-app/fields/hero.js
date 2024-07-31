"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hero = void 0;
var richtext_lexical_1 = require("@payloadcms/richtext-lexical");
var label_1 = require("./lexicalFeatures/label");
var largeBody_1 = require("./lexicalFeatures/largeBody");
var linkGroup_1 = __importDefault(require("./linkGroup"));
var richText_1 = __importDefault(require("./richText"));
exports.hero = {
    name: 'hero',
    fields: [
        {
            name: 'type',
            defaultValue: 'lowImpact',
            label: 'Type',
            options: [
                {
                    label: 'None',
                    value: 'none',
                },
                {
                    label: 'High Impact',
                    value: 'highImpact',
                },
                {
                    label: 'Medium Impact',
                    value: 'mediumImpact',
                },
                {
                    label: 'Low Impact',
                    value: 'lowImpact',
                },
            ],
            required: true,
            type: 'select',
        },
        (0, richText_1.default)({
            editor: (0, richtext_lexical_1.lexicalEditor)({
                features: [
                    (0, richtext_lexical_1.ParagraphFeature)(),
                    (0, richtext_lexical_1.HeadingFeature)({ enabledHeadingSizes: ['h1'] }),
                    (0, richtext_lexical_1.LinkFeature)({}),
                    (0, label_1.LabelFeature)(),
                    (0, largeBody_1.LargeBodyFeature)(),
                ],
            }),
        }),
        (0, linkGroup_1.default)({
            overrides: {
                maxRows: 2,
            },
        }),
        {
            name: 'media',
            admin: {
                condition: function (_, _a) {
                    var _b = _a === void 0 ? {} : _a, type = _b.type;
                    return ['highImpact', 'mediumImpact'].includes(type);
                },
            },
            relationTo: 'media',
            required: true,
            type: 'upload',
        },
    ],
    label: false,
    type: 'group',
};
