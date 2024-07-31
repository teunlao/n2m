"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Media = void 0;
var richtext_lexical_1 = require("@payloadcms/richtext-lexical");
var path_1 = __importDefault(require("path"));
exports.Media = {
    access: {
        create: function () { return true; },
        delete: function () { return true; },
        read: function () { return true; },
        update: function () { return true; },
    },
    admin: {
        description: 'Creating, updating, and deleting media is disabled for this demo.',
    },
    fields: [
        {
            name: 'alt',
            required: true,
            type: 'text',
        },
        {
            name: 'caption',
            editor: (0, richtext_lexical_1.lexicalEditor)({
                features: function (_a) {
                    var defaultFeatures = _a.defaultFeatures;
                    return [(0, richtext_lexical_1.LinkFeature)({})];
                },
            }),
            type: 'richText',
        },
    ],
    slug: 'media',
    upload: {
        staticDir: path_1.default.resolve(__dirname, '../../blog-app/public/media'),
    },
};
