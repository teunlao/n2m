"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultPublicDemoFeatures = void 0;
var richtext_lexical_1 = require("@payloadcms/richtext-lexical");
var label_1 = require("../lexicalFeatures/label");
var largeBody_1 = require("../lexicalFeatures/largeBody");
exports.defaultPublicDemoFeatures = [
    (0, richtext_lexical_1.ParagraphFeature)(),
    (0, richtext_lexical_1.BoldTextFeature)(),
    (0, richtext_lexical_1.ItalicTextFeature)(),
    (0, richtext_lexical_1.UnderlineTextFeature)(),
    (0, richtext_lexical_1.BlockQuoteFeature)(),
    (0, richtext_lexical_1.HeadingFeature)({
        enabledHeadingSizes: ['h2', 'h3', 'h4', 'h5', 'h6'],
    }),
    (0, richtext_lexical_1.LinkFeature)({}),
    (0, largeBody_1.LargeBodyFeature)(),
    (0, label_1.LabelFeature)(),
];
