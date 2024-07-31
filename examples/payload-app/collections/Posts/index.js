"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Posts = void 0;
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
var populateAuthors_1 = require("./hooks/populateAuthors");
var revalidatePost_1 = require("./hooks/revalidatePost");
exports.Posts = {
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
                return "".concat(process.env.PAYLOAD_PUBLIC_SERVER_URL, "/posts/").concat(data === null || data === void 0 ? void 0 : data.slug);
            },
        },
        preview: function (doc) {
            return "".concat(process.env.PAYLOAD_PUBLIC_SERVER_URL, "/api/preview?url=").concat(encodeURIComponent("".concat(process.env.PAYLOAD_PUBLIC_SERVER_URL, "/posts/").concat(doc === null || doc === void 0 ? void 0 : doc.slug)), "&secret=").concat(process.env.PAYLOAD_PUBLIC_DRAFT_SECRET);
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
            name: 'publishedOn',
            admin: {
                date: {
                    pickerAppearance: 'dayAndTime',
                },
                position: 'sidebar',
            },
            hooks: {
                beforeChange: [
                    function (_a) {
                        var siblingData = _a.siblingData, value = _a.value;
                        if (siblingData._status === 'published' && !value) {
                            return new Date();
                        }
                        return value;
                    },
                ],
            },
            type: 'date',
        },
        {
            name: 'authors',
            admin: {
                position: 'sidebar',
            },
            hasMany: true,
            relationTo: 'users',
            required: true,
            type: 'relationship',
        },
        // This field is only used to populate the user data via the `populateAuthors` hook
        // This is because the `user` collection has access control locked to protect user privacy
        // GraphQL will also not return mutated user data that differs from the underlying schema
        {
            name: 'populatedAuthors',
            access: {
                update: function () { return false; },
            },
            admin: {
                disabled: true,
                readOnly: true,
            },
            fields: [
                {
                    name: 'id',
                    type: 'text',
                },
                {
                    name: 'name',
                    type: 'text',
                },
            ],
            type: 'array',
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
                        {
                            name: 'enablePremiumContent',
                            label: 'Enable Premium Content',
                            type: 'checkbox',
                        },
                        {
                            name: 'premiumContent',
                            access: {
                                read: function (_a) {
                                    var req = _a.req;
                                    return req.user;
                                },
                            },
                            blocks: [CallToAction_1.CallToAction, Content_1.Content, MediaBlock_1.MediaBlock, ArchiveBlock_1.Archive],
                            type: 'blocks',
                        },
                    ],
                    label: 'Content',
                },
            ],
            type: 'tabs',
        },
        {
            name: 'relatedPosts',
            filterOptions: function (_a) {
                var id = _a.id;
                return {
                    id: {
                        not_in: [id],
                    },
                };
            },
            hasMany: true,
            relationTo: 'posts',
            type: 'relationship',
        },
        (0, slug_1.slugField)(),
    ],
    hooks: {
        afterChange: [revalidatePost_1.revalidatePost],
        afterRead: [populateArchiveBlock_1.populateArchiveBlock, populateAuthors_1.populateAuthors],
        beforeChange: [populatePublishedDate_1.populatePublishedDate],
    },
    slug: 'posts',
    versions: {
        drafts: true,
    },
};
