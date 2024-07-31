"use strict";
/* eslint-disable regexp/no-obscure-range */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
//This copy-and-pasted from lexical here here: https://github.com/facebook/lexical/blob/c2ceee223f46543d12c574e62155e619f9a18a5d/packages/lexical/src/LexicalConstants.ts
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEXT_TYPE_TO_MODE = exports.TEXT_MODE_TO_TYPE = exports.ELEMENT_FORMAT_TO_TYPE = exports.ELEMENT_TYPE_TO_FORMAT = exports.DETAIL_TYPE_TO_DETAIL = exports.TEXT_TYPE_TO_FORMAT = exports.LTR_REGEX = exports.RTL_REGEX = exports.DOUBLE_LINE_BREAK = exports.NON_BREAKING_SPACE = exports.IS_ALIGN_END = exports.IS_ALIGN_START = exports.IS_ALIGN_JUSTIFY = exports.IS_ALIGN_RIGHT = exports.IS_ALIGN_CENTER = exports.IS_ALIGN_LEFT = exports.IS_UNMERGEABLE = exports.IS_DIRECTIONLESS = exports.IS_ALL_FORMATTING = exports.IS_HIGHLIGHT = exports.IS_SUPERSCRIPT = exports.IS_SUBSCRIPT = exports.IS_CODE = exports.IS_UNDERLINE = exports.IS_STRIKETHROUGH = exports.IS_ITALIC = exports.IS_BOLD = exports.IS_SEGMENTED = exports.IS_TOKEN = exports.IS_NORMAL = exports.FULL_RECONCILE = exports.HAS_DIRTY_NODES = exports.NO_DIRTY_NODES = exports.DOM_TEXT_TYPE = exports.DOM_ELEMENT_TYPE = void 0;
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
// DOM
exports.DOM_ELEMENT_TYPE = 1;
exports.DOM_TEXT_TYPE = 3;
// Reconciling
exports.NO_DIRTY_NODES = 0;
exports.HAS_DIRTY_NODES = 1;
exports.FULL_RECONCILE = 2;
// Text node modes
exports.IS_NORMAL = 0;
exports.IS_TOKEN = 1;
exports.IS_SEGMENTED = 2;
// IS_INERT = 3
// Text node formatting
exports.IS_BOLD = 1;
exports.IS_ITALIC = 1 << 1;
exports.IS_STRIKETHROUGH = 1 << 2;
exports.IS_UNDERLINE = 1 << 3;
exports.IS_CODE = 1 << 4;
exports.IS_SUBSCRIPT = 1 << 5;
exports.IS_SUPERSCRIPT = 1 << 6;
exports.IS_HIGHLIGHT = 1 << 7;
exports.IS_ALL_FORMATTING = exports.IS_BOLD |
    exports.IS_ITALIC |
    exports.IS_STRIKETHROUGH |
    exports.IS_UNDERLINE |
    exports.IS_CODE |
    exports.IS_SUBSCRIPT |
    exports.IS_SUPERSCRIPT |
    exports.IS_HIGHLIGHT;
// Text node details
exports.IS_DIRECTIONLESS = 1;
exports.IS_UNMERGEABLE = 1 << 1;
// Element node formatting
exports.IS_ALIGN_LEFT = 1;
exports.IS_ALIGN_CENTER = 2;
exports.IS_ALIGN_RIGHT = 3;
exports.IS_ALIGN_JUSTIFY = 4;
exports.IS_ALIGN_START = 5;
exports.IS_ALIGN_END = 6;
// Reconciliation
exports.NON_BREAKING_SPACE = '\u00A0';
exports.DOUBLE_LINE_BREAK = '\n\n';
// For FF, we need to use a non-breaking space, or it gets composition
// in a stuck state.
var RTL = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC';
var LTR = 'A-Za-z\u00C0-\u00D6\u00D8-\u00F6' +
    '\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF\u200E\u2C00-\uFB1C' +
    '\uFE00-\uFE6F\uFEFD-\uFFFF';
// eslint-disable-next-line no-misleading-character-class
exports.RTL_REGEX = new RegExp('^[^' + LTR + ']*[' + RTL + ']');
// eslint-disable-next-line no-misleading-character-class
exports.LTR_REGEX = new RegExp('^[^' + RTL + ']*[' + LTR + ']');
exports.TEXT_TYPE_TO_FORMAT = {
    bold: exports.IS_BOLD,
    code: exports.IS_CODE,
    highlight: exports.IS_HIGHLIGHT,
    italic: exports.IS_ITALIC,
    strikethrough: exports.IS_STRIKETHROUGH,
    subscript: exports.IS_SUBSCRIPT,
    superscript: exports.IS_SUPERSCRIPT,
    underline: exports.IS_UNDERLINE,
};
exports.DETAIL_TYPE_TO_DETAIL = {
    directionless: exports.IS_DIRECTIONLESS,
    unmergeable: exports.IS_UNMERGEABLE,
};
exports.ELEMENT_TYPE_TO_FORMAT = {
    center: exports.IS_ALIGN_CENTER,
    end: exports.IS_ALIGN_END,
    justify: exports.IS_ALIGN_JUSTIFY,
    left: exports.IS_ALIGN_LEFT,
    right: exports.IS_ALIGN_RIGHT,
    start: exports.IS_ALIGN_START,
};
exports.ELEMENT_FORMAT_TO_TYPE = (_a = {},
    _a[exports.IS_ALIGN_CENTER] = 'center',
    _a[exports.IS_ALIGN_END] = 'end',
    _a[exports.IS_ALIGN_JUSTIFY] = 'justify',
    _a[exports.IS_ALIGN_LEFT] = 'left',
    _a[exports.IS_ALIGN_RIGHT] = 'right',
    _a[exports.IS_ALIGN_START] = 'start',
    _a);
exports.TEXT_MODE_TO_TYPE = {
    normal: exports.IS_NORMAL,
    segmented: exports.IS_SEGMENTED,
    token: exports.IS_TOKEN,
};
exports.TEXT_TYPE_TO_MODE = (_b = {},
    _b[exports.IS_NORMAL] = 'normal',
    _b[exports.IS_SEGMENTED] = 'segmented',
    _b[exports.IS_TOKEN] = 'token',
    _b);
