"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectsPage = void 0;
var slateToLexical_1 = require("../utilities/lexical/slateToLexical");
exports.projectsPage = {
    _status: 'published',
    hero: {
        media: undefined,
        richText: (0, slateToLexical_1.convertSlateToLexical)([
            {
                children: [
                    {
                        text: 'All projects',
                    },
                ],
                type: 'h1',
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
                            text: 'The projects below are displayed in an "Archive" layout building block which is an extremely powerful way to display documents on a page. It can be auto-populated by collection or by category, or projects can be individually selected. Pagination controls will automatically appear if the number of results exceeds the number of items per page.',
                        },
                    ],
                    type: 'p',
                },
            ]),
            limit: 10,
            populateBy: 'collection',
            relationTo: 'projects',
        },
    ],
    meta: {
        description: 'An open-source website built with Payload and Next.js.',
        image: '{{IMAGE}}',
        title: 'Projects',
    },
    slug: 'projects',
    title: 'Projects',
};
