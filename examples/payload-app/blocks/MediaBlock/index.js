"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaBlock = void 0;
var invertBackground_1 = require("../../fields/invertBackground");
exports.MediaBlock = {
    fields: [
        invertBackground_1.invertBackground,
        {
            name: 'position',
            defaultValue: 'default',
            options: [
                {
                    label: 'Default',
                    value: 'default',
                },
                {
                    label: 'Fullscreen',
                    value: 'fullscreen',
                },
            ],
            type: 'select',
        },
        {
            name: 'media',
            relationTo: 'media',
            required: true,
            type: 'upload',
        },
    ],
    slug: 'mediaBlock',
};
