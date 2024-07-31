"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pages = void 0;
var admins_1 = require("../../access/admins");
var adminsOrPublished_1 = require("../../access/adminsOrPublished");
var ArchiveBlock_1 = require("../../blocks/ArchiveBlock");
var CallToAction_1 = require("../../blocks/CallToAction");
var Content_1 = require("../../blocks/Content");
var ContentMedia_1 = require("../../blocks/ContentMedia");
var MediaBlock_1 = require("../../blocks/MediaBlock");
var hero_1 = require("../../fields/hero");
var slug_1 = require("../../fields/slug");
var populateArchiveBlock_1 = require("../../hooks/populateArchiveBlock");
var populatePublishedDate_1 = require("../../hooks/populatePublishedDate");
var revalidatePage_1 = require("./hooks/revalidatePage");
exports.Pages = {
    access: {
        create: admins_1.admins,
        delete: function () { return false; },
        read: adminsOrPublished_1.adminsOrPublished,
        update: admins_1.admins,
    },
    admin: {
        defaultColumns: ['title', 'slug', 'updatedAt'],
        livePreview: {
            url: function (_a) {
                var data = _a.data;
                return "".concat(process.env.PAYLOAD_PUBLIC_SERVER_URL, "/").concat(data.slug !== 'home' ? data.slug : '');
            },
        },
        preview: function (doc) {
            return "".concat(process.env.PAYLOAD_PUBLIC_SERVER_URL, "/api/preview?url=").concat(encodeURIComponent("".concat(process.env.PAYLOAD_PUBLIC_SERVER_URL, "/").concat(doc.slug !== 'home' ? doc.slug : '')), "&secret=").concat(process.env.PAYLOAD_PUBLIC_DRAFT_SECRET);
        },
        useAsTitle: 'title',
    },
    fields: [
        {
            name: 'title',
            required: true,
            type: 'text',
        },
        {
            name: 'publishedDate',
            admin: {
                position: 'sidebar',
            },
            type: 'date',
        },
        {
            tabs: [
                {
                    fields: [hero_1.hero],
                    label: 'Hero',
                },
                {
                    fields: [
                        {
                            name: 'layout',
                            blocks: [CallToAction_1.CallToAction, Content_1.Content, ContentMedia_1.ContentMedia, MediaBlock_1.MediaBlock, ArchiveBlock_1.Archive],
                            required: true,
                            type: 'blocks',
                        },
                    ],
                    label: 'Content',
                },
            ],
            type: 'tabs',
        },
        (0, slug_1.slugField)(),
    ],
    hooks: {
        afterChange: [revalidatePage_1.revalidatePage],
        afterRead: [populateArchiveBlock_1.populateArchiveBlock],
        beforeChange: [populatePublishedDate_1.populatePublishedDate],
    },
    slug: 'pages',
    versions: {
        drafts: true,
    },
};
