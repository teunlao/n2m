"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Categories = {
    access: {
        delete: function () { return false; },
        read: function () { return true; },
    },
    admin: {
        useAsTitle: 'title',
    },
    fields: [
        {
            name: 'title',
            type: 'text',
        },
    ],
    slug: 'categories',
};
exports.default = Categories;
