"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.image1 = void 0;
var slateToLexical_1 = require("../utilities/lexical/slateToLexical");
exports.image1 = {
    id: '',
    alt: 'Shirts',
    caption: (0, slateToLexical_1.convertSlateToLexical)([
        {
            children: [
                {
                    text: 'Photo by ',
                },
                {
                    children: [
                        {
                            text: 'Voicu Apostol',
                        },
                    ],
                    linkType: 'custom',
                    newTab: true,
                    type: 'link',
                    url: 'https://unsplash.com/@cerpow?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
                },
                {
                    text: ' on ',
                },
                {
                    children: [
                        {
                            text: 'Unsplash',
                        },
                    ],
                    linkType: 'custom',
                    newTab: true,
                    type: 'link',
                    url: 'https://unsplash.com/photos/a-close-up-of-a-pine-tree-branch-Cy1F3H1X3WI?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
                },
                {
                    text: '.',
                },
            ],
        },
    ]),
    createdAt: '',
    updatedAt: '',
};
