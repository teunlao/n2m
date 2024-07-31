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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LargeBodyFeature = void 0;
var selection_1 = require("@lexical/selection");
var utils_1 = require("@lexical/utils");
var richtext_lexical_1 = require("@payloadcms/richtext-lexical");
var lexical_1 = require("lexical");
var LargeBodyNode_1 = require("./nodes/LargeBodyNode");
require("./index.scss");
var LargeBodyFeature = function () {
    return {
        feature: function () { return ({
            floatingSelectToolbar: {
                sections: [
                    (0, richtext_lexical_1.FormatSectionWithEntries)([
                        {
                            ChildComponent: function () {
                                return Promise.resolve().then(function () { return __importStar(require('./Icon')); }).then(function (module) { return module.LargeBodyIcon; });
                            },
                            isActive: function (_a) {
                                var editor = _a.editor, selection = _a.selection;
                                if ((0, lexical_1.$isRangeSelection)(selection)) {
                                    var selectedNode = (0, richtext_lexical_1.getSelectedNode)(selection);
                                    var largeBodyParent = (0, utils_1.$findMatchingParent)(selectedNode, LargeBodyNode_1.$isLargeBodyNode);
                                    return largeBodyParent != null;
                                }
                                return false;
                            },
                            key: 'largeBody',
                            label: "Large Body",
                            onClick: function (_a) {
                                var editor = _a.editor;
                                //setHeading(editor, headingSize)
                                editor.update(function () {
                                    var selection = (0, lexical_1.$getSelection)();
                                    if ((0, lexical_1.$isRangeSelection)(selection)) {
                                        (0, selection_1.$setBlocksType)(selection, function () { return (0, LargeBodyNode_1.$createLargeBodyNode)(); });
                                    }
                                });
                            },
                            order: 20,
                        },
                    ]),
                ],
            },
            nodes: [
                {
                    node: LargeBodyNode_1.LargeBodyNode,
                    type: LargeBodyNode_1.LargeBodyNode.getType(),
                },
            ],
            props: null,
            slashMenu: {
                options: [
                    {
                        options: [
                            new richtext_lexical_1.SlashMenuOption("Large Body", {
                                Icon: function () {
                                    return Promise.resolve().then(function () { return __importStar(require('./Icon')); }).then(function (module) { return module.LargeBodyIcon; });
                                },
                                keywords: ['largeBody'],
                                onSelect: function (_a) {
                                    var editor = _a.editor;
                                    var selection = (0, lexical_1.$getSelection)();
                                    if ((0, lexical_1.$isRangeSelection)(selection)) {
                                        (0, selection_1.$setBlocksType)(selection, function () { return (0, LargeBodyNode_1.$createLargeBodyNode)(); });
                                    }
                                },
                            }),
                        ],
                        key: 'Basic',
                        displayName: 'Basic',
                    },
                ],
            },
        }); },
        key: 'largeBody',
    };
};
exports.LargeBodyFeature = LargeBodyFeature;
