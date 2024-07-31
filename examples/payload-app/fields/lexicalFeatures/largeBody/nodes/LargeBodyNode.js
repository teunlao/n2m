"use strict";
/** @module @lexical/largeBody */
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.$isLargeBodyNode = exports.$createLargeBodyNode = exports.LargeBodyNode = void 0;
var utils_1 = require("@lexical/utils");
var lexical_1 = require("lexical");
/** @noInheritDoc */
var LargeBodyNode = /** @class */ (function (_super) {
    __extends(LargeBodyNode, _super);
    function LargeBodyNode(_a) {
        var key = _a.key;
        return _super.call(this, key) || this;
    }
    LargeBodyNode.clone = function (node) {
        return new LargeBodyNode({
            key: node.__key,
        });
    };
    LargeBodyNode.getType = function () {
        return 'largeBody';
    };
    LargeBodyNode.importJSON = function (serializedNode) {
        var node = $createLargeBodyNode();
        node.setFormat(serializedNode.format);
        node.setIndent(serializedNode.indent);
        node.setDirection(serializedNode.direction);
        return node;
    };
    LargeBodyNode.prototype.canBeEmpty = function () {
        return true;
    };
    LargeBodyNode.prototype.canInsertTextAfter = function () {
        return true;
    };
    LargeBodyNode.prototype.canInsertTextBefore = function () {
        return true;
    };
    LargeBodyNode.prototype.collapseAtStart = function () {
        var paragraph = (0, lexical_1.$createParagraphNode)();
        var children = this.getChildren();
        children.forEach(function (child) { return paragraph.append(child); });
        this.replace(paragraph);
        return true;
    };
    LargeBodyNode.prototype.createDOM = function (config) {
        var element = document.createElement('span');
        (0, utils_1.addClassNamesToElement)(element, 'largeBody');
        return element;
    };
    LargeBodyNode.prototype.exportDOM = function (editor) {
        var element = _super.prototype.exportDOM.call(this, editor).element;
        if (element && (0, lexical_1.isHTMLElement)(element)) {
            if (this.isEmpty())
                element.append(document.createElement('br'));
            var formatType = this.getFormatType();
            element.style.textAlign = formatType;
            var direction = this.getDirection();
            if (direction) {
                element.dir = direction;
            }
        }
        return {
            element: element,
        };
    };
    LargeBodyNode.prototype.exportJSON = function () {
        return __assign(__assign({}, _super.prototype.exportJSON.call(this)), { type: this.getType() });
    };
    LargeBodyNode.prototype.insertNewAfter = function (_, restoreSelection) {
        var newBlock = (0, lexical_1.$createParagraphNode)();
        var direction = this.getDirection();
        newBlock.setDirection(direction);
        this.insertAfter(newBlock, restoreSelection);
        return newBlock;
    };
    // Mutation
    LargeBodyNode.prototype.isInline = function () {
        return false;
    };
    LargeBodyNode.prototype.updateDOM = function (prevNode, dom) {
        return false;
    };
    return LargeBodyNode;
}(lexical_1.ElementNode));
exports.LargeBodyNode = LargeBodyNode;
function $createLargeBodyNode() {
    return (0, lexical_1.$applyNodeReplacement)(new LargeBodyNode({}));
}
exports.$createLargeBodyNode = $createLargeBodyNode;
function $isLargeBodyNode(node) {
    return node instanceof LargeBodyNode;
}
exports.$isLargeBodyNode = $isLargeBodyNode;
