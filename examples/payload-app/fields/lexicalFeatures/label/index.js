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
exports.LabelFeature = void 0;
var selection_1 = require("@lexical/selection");
var utils_1 = require("@lexical/utils");
var richtext_lexical_1 = require("@payloadcms/richtext-lexical");
var lexical_1 = require("lexical");
var LabelNode_1 = require("./nodes/LabelNode");
require("./index.scss");
var LabelFeature = function () {
    return {
        feature: function () { return ({
            floatingSelectToolbar: {
                sections: [
                    (0, richtext_lexical_1.FormatSectionWithEntries)([
                        {
                            ChildComponent: function () {
                                return Promise.resolve().then(function () { return __importStar(require('./Icon')); }).then(function (module) { return module.LabelIcon; });
                            },
                            isActive: function (_a) {
                                var selection = _a.selection;
                                if ((0, lexical_1.$isRangeSelection)(selection)) {
                                    var selectedNode = (0, richtext_lexical_1.getSelectedNode)(selection);
                                    var labelParent = (0, utils_1.$findMatchingParent)(selectedNode, LabelNode_1.$isLabelNode);
                                    return labelParent != null;
                                }
                                return false;
                            },
                            key: 'label',
                            label: "Label",
                            onClick: function (_a) {
                                var editor = _a.editor;
                                //setHeading(editor, headingSize)
                                editor.update(function () {
                                    var selection = (0, lexical_1.$getSelection)();
                                    if ((0, lexical_1.$isRangeSelection)(selection)) {
                                        (0, selection_1.$setBlocksType)(selection, function () { return (0, LabelNode_1.$createLabelNode)(); });
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
                    node: LabelNode_1.LabelNode,
                    type: LabelNode_1.LabelNode.getType(),
                },
            ],
            props: null,
            slashMenu: {
                options: [
                    {
                        options: [
                            new richtext_lexical_1.SlashMenuOption("Label", {
                                Icon: function () {
                                    return Promise.resolve().then(function () { return __importStar(require('./Icon')); }).then(function (module) { return module.LabelIcon; });
                                },
                                keywords: ['label'],
                                onSelect: function () {
                                    var selection = (0, lexical_1.$getSelection)();
                                    if ((0, lexical_1.$isRangeSelection)(selection)) {
                                        (0, selection_1.$setBlocksType)(selection, function () { return (0, LabelNode_1.$createLabelNode)(); });
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
        key: 'label',
    };
};
exports.LabelFeature = LabelFeature;
