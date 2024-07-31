"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
exports.Settings = {
    access: {
        read: function () { return true; },
    },
    fields: [
        {
            name: 'postsPage',
            label: 'Posts page',
            relationTo: 'pages',
            type: 'relationship',
        },
        {
            name: 'projectsPage',
            label: 'Projects page',
            relationTo: 'pages',
            type: 'relationship',
        },
    ],
    graphQL: {
        name: 'Settings',
    },
    slug: 'settings',
    typescript: {
        interface: 'Settings',
    },
};
