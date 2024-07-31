"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertSlateToLexical = void 0;
var nodeFormat_1 = require("../lexicalToReact/nodeFormat");
function convertSlateToLexical(slateData) {
    return {
        root: {
            children: convertSlateNodesToLexical(slateData, true, 'root'),
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'root',
            version: 1,
        },
    };
}
exports.convertSlateToLexical = convertSlateToLexical;
function convertSlateNodesToLexical(slateNodes, canContainParagraphs, parentNode) {
    return (slateNodes.map(function (node) {
        if (!('type' in node)) {
            if (canContainParagraphs) {
                // This is a paragraph node. They do not have a type property in Slate
                return convertParagraphNode(node, parentNode);
            }
            else {
                // This is a simple text node. canContainParagraphs may be false if this is nested inside of a paragraph already, since paragraphs cannot contain paragraphs
                return convertTextNode(node, parentNode);
            }
        }
        switch (node.type) {
            case 'p':
                return convertParagraphNode(node, parentNode);
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'h5':
            case 'h6':
                return convertHeadingNode(node, parentNode);
            case 'link':
                return convertLinkNode(node, parentNode);
            case 'relationship':
                return convertRelationshipNode(node, parentNode);
            case 'ul':
                return convertULNode(node, parentNode);
            case 'li':
                return convertLINode(node, parentNode);
            case 'upload':
                return convertUploadNode(node, parentNode);
            default:
                // eslint-disable-next-line no-console
                console.warn('slateToLexical > No converter found for node type: ' + node.type);
                return; // or some default behavior
        }
    }) || []);
}
function convertTextNode(node, parentNode) {
    return {
        detail: 0,
        format: convertNodeToFormat(node),
        mode: 'normal',
        style: '',
        text: node.text,
        type: 'text',
        version: 1,
    };
}
function convertParagraphNode(node, parentNode) {
    return {
        children: convertSlateNodesToLexical(node.children || [], false, 'paragraph'),
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
    };
}
function convertHeadingNode(node, parentNode) {
    return {
        children: convertSlateNodesToLexical(node.children || [], false, 'heading'),
        direction: 'ltr',
        format: '',
        indent: 0,
        tag: node.type,
        type: 'heading',
        version: 1,
    };
}
function convertLinkNode(node, parentNode) {
    return {
        children: convertSlateNodesToLexical(node.children || [], false, 'link'),
        direction: 'ltr',
        fields: {
            doc: node.doc || undefined,
            linkType: node.linkType || 'custom',
            newTab: node.newTab || false,
            url: node.url || undefined,
        },
        format: '',
        indent: 0,
        type: 'link',
        version: 1,
    };
}
function convertRelationshipNode(node, parentNode) {
    var _a;
    return {
        format: '',
        relationTo: node.relationTo,
        type: 'relationship',
        value: {
            id: ((_a = node === null || node === void 0 ? void 0 : node.value) === null || _a === void 0 ? void 0 : _a.id) || '',
        },
        version: 1,
    };
}
function convertULNode(node, parentNode) {
    return {
        children: convertSlateNodesToLexical(node.children || [], false, 'list'),
        direction: 'ltr',
        format: '',
        indent: 0,
        listType: 'bullet',
        start: 1,
        tag: 'ul',
        type: 'list',
        version: 1,
    };
}
function convertLINode(node, parentNode) {
    return {
        checked: undefined,
        children: convertSlateNodesToLexical(node.children || [], false, 'listitem'),
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'listitem',
        value: 1,
        version: 1,
    };
}
function convertUploadNode(node, parentNode) {
    var _a;
    return {
        fields: __assign({}, node.fields),
        format: '',
        relationTo: node.relationTo,
        type: 'upload',
        value: {
            id: ((_a = node.value) === null || _a === void 0 ? void 0 : _a.id) || '',
        },
        version: 1,
    };
}
function convertNodeToFormat(node) {
    var format = 0;
    if (node.bold) {
        format = format | nodeFormat_1.IS_BOLD;
    }
    if (node.italic) {
        format = format | nodeFormat_1.IS_ITALIC;
    }
    if (node.strikethrough) {
        format = format | nodeFormat_1.IS_STRIKETHROUGH;
    }
    if (node.underline) {
        format = format | nodeFormat_1.IS_UNDERLINE;
    }
    if (node.subscript) {
        format = format | nodeFormat_1.IS_SUBSCRIPT;
    }
    if (node.superscript) {
        format = format | nodeFormat_1.IS_SUPERSCRIPT;
    }
    if (node.code) {
        format = format | nodeFormat_1.IS_CODE;
    }
    return format;
}
