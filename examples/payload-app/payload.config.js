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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bundler_webpack_1 = require("@payloadcms/bundler-webpack"); // bundler-import
var db_mongodb_1 = require("@payloadcms/db-mongodb"); // database-adapter-import
var plugin_cloud_1 = require("@payloadcms/plugin-cloud");
// import formBuilder from '@payloadcms/plugin-form-builder'
var plugin_nested_docs_1 = __importDefault(require("@payloadcms/plugin-nested-docs"));
var plugin_redirects_1 = __importDefault(require("@payloadcms/plugin-redirects"));
var plugin_seo_1 = __importDefault(require("@payloadcms/plugin-seo"));
var richtext_lexical_1 = require("@payloadcms/richtext-lexical");
var path_1 = __importDefault(require("path"));
var config_1 = require("payload/config");
var Categories_1 = __importDefault(require("./collections/Categories"));
var Comments_1 = __importDefault(require("./collections/Comments"));
var Media_1 = require("./collections/Media");
var Pages_1 = require("./collections/Pages");
var Posts_1 = require("./collections/Posts");
var Projects_1 = require("./collections/Projects");
var Users_1 = __importDefault(require("./collections/Users"));
var BeforeDashboard_1 = __importDefault(require("./components/BeforeDashboard"));
var BeforeLogin_1 = __importDefault(require("./components/BeforeLogin"));
var resetDB_1 = require("./endpoints/resetDB");
var Footer_1 = require("./globals/Footer");
var Header_1 = require("./globals/Header");
var Settings_1 = require("./globals/Settings");
var generateTitle = function () {
    return 'Payload Public Demo';
};
var m = path_1.default.resolve(__dirname, './emptyModuleMock.js');
exports.default = (0, config_1.buildConfig)({
    admin: {
        autoLogin: {
            email: 'demo@payloadcms.com',
            password: 'demo',
            prefillOnly: true,
        },
        bundler: (0, bundler_webpack_1.webpackBundler)(),
        components: {
            beforeDashboard: [BeforeDashboard_1.default],
            beforeLogin: [BeforeLogin_1.default],
        },
        livePreview: {
            breakpoints: [
                {
                    name: 'mobile',
                    height: 667,
                    label: 'Mobile',
                    width: 375,
                },
            ],
        },
        user: Users_1.default.slug,
        webpack: function (config) {
            var _a;
            var _b;
            return (__assign(__assign({}, config), { resolve: __assign(__assign({}, config.resolve), { alias: __assign(__assign({}, (_b = config.resolve) === null || _b === void 0 ? void 0 : _b.alias), (_a = { express: m }, _a[path_1.default.resolve(__dirname, './cron/reset')] = m, _a)) }) }));
        },
    },
    collections: [Pages_1.Pages, Posts_1.Posts, Projects_1.Projects, Media_1.Media, Categories_1.default, Users_1.default, Comments_1.default],
    cors: [process.env.PAYLOAD_PUBLIC_SERVER_URL || ''].filter(Boolean),
    csrf: [process.env.PAYLOAD_PUBLIC_SERVER_URL || ''].filter(Boolean),
    editor: (0, richtext_lexical_1.lexicalEditor)({}),
    endpoints: [resetDB_1.resetDBEndpoint, resetDB_1.seedDBEndpoint, resetDB_1.clearDBEndpoint],
    globals: [Settings_1.Settings, Header_1.Header, Footer_1.Footer],
    graphQL: {
        disablePlaygroundInProduction: false,
        schemaOutputFile: path_1.default.resolve(__dirname, 'generated-schema.graphql'),
    },
    rateLimit: {
        max: 10000,
        trustProxy: true,
        window: 2 * 60 * 1000, // 2 minutes
    },
    serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
    typescript: {
        outputFile: path_1.default.resolve(__dirname, 'payload-types.ts'),
    },
    // database-adapter-config-start
    db: (0, db_mongodb_1.mongooseAdapter)({
        url: process.env.DATABASE_URI,
    }),
    // database-adapter-config-end
    plugins: [
        // formBuilder({}),
        (0, plugin_redirects_1.default)({
            collections: ['pages', 'posts'],
        }),
        (0, plugin_nested_docs_1.default)({
            collections: ['categories'],
        }),
        (0, plugin_seo_1.default)({
            collections: ['pages', 'posts', 'projects'],
            generateTitle: generateTitle,
            uploadsCollection: 'media',
        }),
        (0, plugin_cloud_1.payloadCloud)(),
    ],
});
