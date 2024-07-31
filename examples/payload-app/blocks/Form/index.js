"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormBlock = void 0;
var richText_1 = __importDefault(require("../../fields/richText"));
exports.FormBlock = {
    fields: [
        {
            name: 'form',
            relationTo: 'forms',
            required: true,
            type: 'relationship',
        },
        {
            name: 'enableIntro',
            label: 'Enable Intro Content',
            type: 'checkbox',
        },
        (0, richText_1.default)({
            name: 'introContent',
            admin: {
                condition: function (_, _a) {
                    var enableIntro = _a.enableIntro;
                    return Boolean(enableIntro);
                },
            },
            label: 'Intro Content',
        }),
    ],
    graphQL: {
        singularName: 'FormBlock',
    },
    labels: {
        plural: 'Form Blocks',
        singular: 'Form Block',
    },
    slug: 'formBlock',
};
