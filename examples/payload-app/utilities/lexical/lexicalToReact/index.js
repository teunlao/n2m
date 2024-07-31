"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeLexical = void 0;
var escape_html_1 = __importDefault(require("escape-html"));
var react_1 = __importStar(require("react"));
var nodeFormat_1 = require("./nodeFormat");
function serializeLexical(_a) {
    var nodes = _a.nodes;
    return (react_1.default.createElement(react_1.Fragment, null, nodes === null || nodes === void 0 ? void 0 : nodes.map(function (_node, index) {
        if (_node.type === 'text') {
            var node = _node;
            var text = (react_1.default.createElement("span", { dangerouslySetInnerHTML: { __html: (0, escape_html_1.default)(node.text) }, key: index }));
            if (node.format & nodeFormat_1.IS_BOLD) {
                text = react_1.default.createElement("strong", { key: index }, text);
            }
            if (node.format & nodeFormat_1.IS_ITALIC) {
                text = react_1.default.createElement("em", { key: index }, text);
            }
            if (node.format & nodeFormat_1.IS_STRIKETHROUGH) {
                text = (react_1.default.createElement("span", { className: "line-through", key: index }, text));
            }
            if (node.format & nodeFormat_1.IS_UNDERLINE) {
                text = (react_1.default.createElement("span", { className: "underline", key: index }, text));
            }
            if (node.format & nodeFormat_1.IS_CODE) {
                text = react_1.default.createElement("code", { key: index }, text);
            }
            if (node.format & nodeFormat_1.IS_SUBSCRIPT) {
                text = react_1.default.createElement("sub", { key: index }, text);
            }
            if (node.format & nodeFormat_1.IS_SUPERSCRIPT) {
                text = react_1.default.createElement("sup", { key: index }, text);
            }
            return text;
        }
        if (_node == null) {
            return null;
        }
        // NOTE: Hacky fix for
        // https://github.com/facebook/lexical/blob/d10c4e6e55261b2fdd7d1845aed46151d0f06a8c/packages/lexical-list/src/LexicalListItemNode.ts#L133
        // which does not return checked: false (only true - i.e. there is no prop for false)
        var serializedChildrenFn = function (node) {
            if (node.children == null) {
                return null;
            }
            else {
                if ((node === null || node === void 0 ? void 0 : node.type) === 'list' && (node === null || node === void 0 ? void 0 : node.listType) === 'check') {
                    for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                        var item = _a[_i];
                        if ('checked' in item) {
                            if (!(item === null || item === void 0 ? void 0 : item.checked)) {
                                item.checked = false;
                            }
                        }
                    }
                    return serializeLexical({ nodes: node.children });
                }
                else {
                    return serializeLexical({ nodes: node.children });
                }
            }
        };
        var serializedChildren = 'children' in _node ? serializedChildrenFn(_node) : '';
        switch (_node.type) {
            case 'linebreak': {
                return react_1.default.createElement("br", { key: index });
            }
            case 'paragraph': {
                return react_1.default.createElement("p", { key: index }, serializedChildren);
            }
            case 'heading': {
                var node = _node;
                var Tag = node === null || node === void 0 ? void 0 : node.tag;
                return react_1.default.createElement(Tag, { key: index }, serializedChildren);
            }
            case 'list': {
                var node = _node;
                var Tag = node === null || node === void 0 ? void 0 : node.tag;
                return (react_1.default.createElement(Tag, { className: node === null || node === void 0 ? void 0 : node.listType, key: index }, serializedChildren));
            }
            case 'listitem': {
                var node = _node;
                if ((node === null || node === void 0 ? void 0 : node.checked) != null) {
                    return (react_1.default.createElement("li", { "aria-checked": node.checked ? 'true' : 'false', className: "component--list-item-checkbox ".concat(node.checked
                            ? 'component--list-item-checkbox-checked'
                            : 'component--list-item-checked-unchecked'), key: index, 
                        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                        role: "checkbox", tabIndex: -1, value: node === null || node === void 0 ? void 0 : node.value }, serializedChildren));
                }
                else {
                    return (react_1.default.createElement("li", { key: index, value: node === null || node === void 0 ? void 0 : node.value }, serializedChildren));
                }
            }
            case 'quote': {
                var node = _node;
                return react_1.default.createElement("blockquote", { key: index }, serializedChildren);
            }
            case 'link': {
                var node = _node;
                var fields = node.fields;
                if (fields.linkType === 'custom') {
                    var rel = fields.newTab ? 'noopener noreferrer' : undefined;
                    return (react_1.default.createElement("a", { href: fields.url, key: index, rel: rel, target: fields.newTab ? 'target="_blank"' : undefined }, serializedChildren));
                }
                else {
                    return react_1.default.createElement("span", { key: index }, "Internal link coming soon");
                }
            }
            default:
                return null;
        }
    })));
}
exports.serializeLexical = serializeLexical;
