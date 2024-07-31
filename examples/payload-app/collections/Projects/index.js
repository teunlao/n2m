"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Projects = void 0;
var admins_1 = require("../../access/admins");
var adminsOrPublished_1 = require("../../access/adminsOrPublished");
var ArchiveBlock_1 = require("../../blocks/ArchiveBlock");
var CallToAction_1 = require("../../blocks/CallToAction");
var Content_1 = require("../../blocks/Content");
var ContentMedia_1 = require("../../blocks/ContentMedia");
var MediaBlock_1 = require("../../blocks/MediaBlock");
var richText_1 = __importDefault(require("../../fields/richText"));
var slug_1 = require("../../fields/slug");
var populateArchiveBlock_1 = require("../../hooks/populateArchiveBlock");
var populatePublishedDate_1 = require("../../hooks/populatePublishedDate");
var revalidateProject_1 = require("./hooks/revalidateProject");
exports.Projects = {
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
                return "".concat(process.env.PAYLOAD_PUBLIC_SERVER_URL, "/projects/").concat(data === null || data === void 0 ? void 0 : data.slug);
            },
        },
        preview: function (doc) {
            return "".concat(process.env.PAYLOAD_PUBLIC_SERVER_URL, "/api/preview?url=").concat(encodeURIComponent("".concat(process.env.PAYLOAD_PUBLIC_SERVER_URL, "/projects/").concat(doc === null || doc === void 0 ? void 0 : doc.slug)), "&secret=").concat(process.env.PAYLOAD_PUBLIC_DRAFT_SECRET);
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
            name: 'categories',
            admin: {
                position: 'sidebar',
            },
            hasMany: true,
            relationTo: 'categories',
            type: 'relationship',
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
                    fields: [
                        {
                            name: 'hero',
                            fields: [
                                (0, richText_1.default)(),
                                {
                                    name: 'media',
                                    relationTo: 'media',
                                    type: 'upload',
                                },
                            ],
                            type: 'group',
                        },
                    ],
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
        {
            name: 'relatedProjects',
            filterOptions: function (_a) {
                var id = _a.id;
                return {
                    id: {
                        not_in: [id],
                    },
                };
            },
            hasMany: true,
            relationTo: 'projects',
            type: 'relationship',
        },
        (0, slug_1.slugField)(),
    ],
    hooks: {
        afterChange: [revalidateProject_1.revalidateProject],
        afterRead: [populateArchiveBlock_1.populateArchiveBlock],
        beforeChange: [populatePublishedDate_1.populatePublishedDate],
    },
    slug: 'projects',
    versions: {
        drafts: true,
    },
};
