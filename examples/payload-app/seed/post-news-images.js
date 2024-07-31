"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postNewsHope = exports.postNewsDest = exports.postNews2 = void 0;
var slateToLexical_1 = require("../utilities/lexical/slateToLexical");
exports.postNews2 = {
    id: '',
    alt: 'News',
    caption: (0, slateToLexical_1.convertSlateToLexical)([
        {
            children: [
                {
                    text: 'Photo by ',
                },
                {
                    children: [
                        {
                            text: 'Bogomil Mihaylov',
                        },
                    ],
                    linkType: 'custom',
                    newTab: true,
                    type: 'link',
                    url: 'https://unsplash.com/@bogomi?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash',
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
                    url: 'https://unsplash.com/photos/ekHSHvgr27k?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash',
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
exports.postNewsDest = {
    id: '',
    alt: 'Hidden Destination',
    caption: (0, slateToLexical_1.convertSlateToLexical)([
        {
            children: [
                {
                    text: 'Photo by ',
                },
                {
                    children: [
                        {
                            text: 'Jamie Davies',
                        },
                    ],
                    linkType: 'custom',
                    newTab: true,
                    type: 'link',
                    url: 'https://unsplash.com/@jamie_davies?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash',
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
                    url: 'https://unsplash.com/photos/_sdfPvaJkWU?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash',
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
exports.postNewsHope = {
    id: '',
    alt: 'Recovery and Hope',
    caption: (0, slateToLexical_1.convertSlateToLexical)([
        {
            children: [
                {
                    text: 'Photo by ',
                },
                {
                    children: [
                        {
                            text: 'John Towner',
                        },
                    ],
                    linkType: 'custom',
                    newTab: true,
                    type: 'link',
                    url: 'https://unsplash.com/@heytowner?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash',
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
                    url: 'https://unsplash.com/photos/3Kv48NS4WUU?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash',
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
