"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsPage = void 0;
var slateToLexical_1 = require("../utilities/lexical/slateToLexical");
exports.postsPage = {
    _status: 'published',
    hero: {
        media: undefined,
        richText: (0, slateToLexical_1.convertSlateToLexical)([
            {
                children: [
                    {
                        text: 'All posts',
                    },
                ],
                type: 'h1',
            },
            {
                children: [
                    {
                        text: 'This page displays all or some of the posts of your blog. Each post is complete with a dynamic page layout builder for a completely custom user experience that is under your full control.',
                    },
                ],
                type: 'p',
            },
        ]),
        type: 'lowImpact',
    },
    layout: [
        {
            blockName: 'Archive Block',
            blockType: 'archive',
            categories: [],
            introContent: (0, slateToLexical_1.convertSlateToLexical)([
                {
                    children: [
                        {
                            text: 'All posts',
                        },
                    ],
                    type: 'h4',
                },
                {
                    children: [
                        {
                            text: 'The posts below are displayed in an "Archive" layout building block which is an extremely powerful way to display documents on a page. It can be auto-populated by collection or by category, or posts can be individually selected. Pagination controls will automatically appear if the number of results exceeds the number of items per page.',
                        },
                    ],
                    type: 'p',
                },
            ]),
            limit: 10,
            populateBy: 'collection',
            relationTo: 'posts',
        },
    ],
    meta: {
        description: 'An open-source website built with Payload and Next.js.',
        image: '{{IMAGE}}',
        title: 'Posts',
    },
    slug: 'posts',
    title: 'Posts',
};
