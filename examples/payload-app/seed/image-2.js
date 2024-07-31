"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.image2 = void 0;
var slateToLexical_1 = require("../utilities/lexical/slateToLexical");
exports.image2 = {
    id: '',
    alt: 'E-Book',
    caption: (0, slateToLexical_1.convertSlateToLexical)([
        {
            children: [
                {
                    text: 'Photo by ',
                },
                {
                    children: [
                        {
                            text: 'Sebastian Svenson',
                        },
                    ],
                    linkType: 'custom',
                    newTab: true,
                    type: 'link',
                    url: 'https://unsplash.com/@sebastiansvenson?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
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
                    url: 'https://unsplash.com/photos/d2w-_1LJioQ?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
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
