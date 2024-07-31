"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var richtext_lexical_1 = require("@payloadcms/richtext-lexical");
var deepMerge_1 = __importDefault(require("../../utilities/deepMerge"));
var link_1 = __importDefault(require("../link"));
var defaultFeatures_1 = require("./defaultFeatures");
var richText = function (overrides, additions) {
    if (additions === void 0) { additions = {
        features: [],
    }; }
    return (0, deepMerge_1.default)({
        name: 'richText',
        editor: (0, richtext_lexical_1.lexicalEditor)({
            features: function () { return __spreadArray(__spreadArray([], __spreadArray(__spreadArray([], defaultFeatures_1.defaultPublicDemoFeatures, true), (additions.features || []), true), true), [
                (0, richtext_lexical_1.UploadFeature)({
                    collections: {
                        media: {
                            fields: [
                                {
                                    name: 'caption',
                                    editor: (0, richtext_lexical_1.lexicalEditor)({
                                        features: function () { return __spreadArray([(0, richtext_lexical_1.ParagraphFeature)()], defaultFeatures_1.defaultPublicDemoFeatures, true); },
                                    }),
                                    label: 'Caption',
                                    type: 'richText',
                                },
                                {
                                    name: 'alignment',
                                    label: 'Alignment',
                                    options: [
                                        {
                                            label: 'Left',
                                            value: 'left',
                                        },
                                        {
                                            label: 'Center',
                                            value: 'center',
                                        },
                                        {
                                            label: 'Right',
                                            value: 'right',
                                        },
                                    ],
                                    type: 'radio',
                                },
                                {
                                    name: 'enableLink',
                                    label: 'Enable Link',
                                    type: 'checkbox',
                                },
                                (0, link_1.default)({
                                    appearances: false,
                                    disableLabel: true,
                                    overrides: {
                                        admin: {
                                            condition: function (_, data) { return Boolean(data === null || data === void 0 ? void 0 : data.enableLink); },
                                        },
                                    },
                                }),
                            ],
                        },
                    },
                }),
            ], false); },
        }),
        required: true,
        type: 'richText',
    }, overrides || {});
};
exports.default = richText;
