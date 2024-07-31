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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDB = exports.clearDB = exports.reset = exports.seed = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var payload_1 = __importDefault(require("payload"));
var home_1 = require("../seed/home");
var image_1_1 = require("../seed/image-1");
var image_2_1 = require("../seed/image-2");
var image_spheres_1 = require("../seed/image-spheres");
var post_1_1 = require("../seed/post-1");
var post_2_1 = require("../seed/post-2");
var post_3_1 = require("../seed/post-3");
var post_finance_images_1 = require("../seed/post-finance-images");
var post_news_images_1 = require("../seed/post-news-images");
var post_tech_images_1 = require("../seed/post-tech-images");
var posts_page_1 = require("../seed/posts-page");
var project_1_1 = require("../seed/project-1");
var project_2_1 = require("../seed/project-2");
var project_3_1 = require("../seed/project-3");
var project_design_images_1 = require("../seed/project-design-images");
var project_eng_images_1 = require("../seed/project-eng-images");
var project_software_images_1 = require("../seed/project-software-images");
var projects_page_1 = require("../seed/projects-page");
var shared_1 = require("./shared");
var collections = [
    'categories',
    'media',
    'pages',
    'posts',
    'projects',
    'comments',
    'users',
    'redirects',
];
var globals = ['header', 'settings', 'footer'];
function seed() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    payload_1.default.logger.info("Seeding database...");
                    return [4 /*yield*/, (0, exports.clearDB)()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, seedDB()];
                case 2:
                    _a.sent();
                    payload_1.default.logger.info("Seed Complete.");
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error(error_1); // eslint-disable-line no-console
                    payload_1.default.logger.error('Error seeding database.');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.seed = seed;
function reset() {
    return __awaiter(this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    payload_1.default.logger.info("Resetting database...");
                    return [4 /*yield*/, (0, exports.clearDB)()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, seedDB()];
                case 2:
                    _a.sent();
                    payload_1.default.logger.info("Reset Complete.");
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error(error_2); // eslint-disable-line no-console
                    payload_1.default.logger.error('Error resetting database.');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.reset = reset;
var clearDB = function () { return __awaiter(void 0, void 0, void 0, function () {
    var mediaDir;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                payload_1.default.logger.info("\u2014 Clearing media...");
                mediaDir = path_1.default.resolve(__dirname, '../../../media');
                if (fs_1.default.existsSync(mediaDir)) {
                    fs_1.default.rmSync(path_1.default.resolve(__dirname, '../../../media'), { recursive: true });
                }
                payload_1.default.logger.info("\u2014 Clearing collections and globals...");
                return [4 /*yield*/, Promise.all(__spreadArray(__spreadArray([], collections.map(function (collection) { return __awaiter(void 0, void 0, void 0, function () {
                        var error_3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, payload_1.default.delete({
                                            collection: collection,
                                            where: {},
                                        })];
                                case 1:
                                    _a.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_3 = _a.sent();
                                    console.error("Error deleting collection ".concat(collection, ":"), error_3); // eslint-disable-line no-console
                                    throw error_3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); }), true), globals.map(function (global) { return __awaiter(void 0, void 0, void 0, function () {
                        var error_4;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, payload_1.default.updateGlobal({
                                            data: {},
                                            slug: global,
                                        })];
                                case 1:
                                    _a.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_4 = _a.sent();
                                    console.error("Error updating global ".concat(global, ":"), error_4); // eslint-disable-line no-console
                                    throw error_4;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); }), true))];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.clearDB = clearDB;
function seedDB() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, demoAuthorID, demoUserID, _b, _c, _d, _e, image1Doc, image2Doc, imageSpheresDoc, postImage1Doc, postTechAi1Doc, postTechIot1Doc, postTechQuant1Doc, postImage2Doc, postNewsHope2Doc, postNewsDest2Doc, postImage3Doc, postFinanceStocks3Doc, postFinanceBuildings3Doc, projectDesignDoc, projectDesign2Doc, projectDesign3Doc, projectSoftwareDoc, projectSoftware2Doc, projectSoftware3Doc, projectSoftware4Doc, projectEngDoc, projectEng2Doc, projectEng3Doc, projectEng4Doc, _f, _g, _h, _j, technologyCategory, newsCategory, financeCategory, designCat, softwareCat, engineeringCat, _k, _l, _m, post1Doc, post2Doc, post3Doc, posts, _o, _p, _q, project1Doc, project2Doc, project3Doc, _r, _s, _t, postsPageID, projectsPageID;
        var _this = this;
        return __generator(this, function (_u) {
            switch (_u.label) {
                case 0:
                    payload_1.default.logger.info("\u2014 Seeding demo author and user...");
                    _c = (_b = Promise).all;
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'users',
                            data: {
                                name: 'Demo Author',
                                email: shared_1.adminEmail,
                                password: shared_1.adminPassword,
                                roles: ['admin'],
                            },
                        })];
                case 1:
                    _d = [
                        _u.sent()
                    ];
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'users',
                            data: {
                                name: 'Demo User',
                                email: 'demo-user@payloadcms.com',
                                password: 'password',
                                roles: ['user'],
                            },
                        })];
                case 2: return [4 /*yield*/, _c.apply(_b, [_d.concat([
                            _u.sent()
                        ])])];
                case 3:
                    _a = _u.sent(), demoAuthorID = _a[0].id, demoUserID = _a[1].id;
                    payload_1.default.logger.info("\u2014 Seeding media...");
                    _g = (_f = Promise).all;
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'media',
                            data: image_1_1.image1,
                            filePath: path_1.default.resolve(__dirname, 'image-1.jpg'),
                        })];
                case 4:
                    _h = [
                        _u.sent()
                    ];
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'media',
                            data: image_2_1.image2,
                            filePath: path_1.default.resolve(__dirname, 'image-2.jpg'),
                        })];
                case 5:
                    _h = _h.concat([
                        _u.sent()
                    ]);
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'media',
                            data: image_spheres_1.imageSpheres,
                            filePath: path_1.default.resolve(__dirname, 'image-spheres.jpg'),
                        })];
                case 6:
                    _h = _h.concat([
                        _u.sent()
                    ]);
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'media',
                            data: post_tech_images_1.postTech1,
                            filePath: path_1.default.resolve(__dirname, 'post-tech-1.jpg'),
                        })];
                case 7:
                    _h = _h.concat([
                        _u.sent()
                    ]);
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'media',
                            data: post_tech_images_1.postTechAi,
                            filePath: path_1.default.resolve(__dirname, 'post-ai-1.jpg'),
                        })];
                case 8:
                    _h = _h.concat([
                        _u.sent()
                    ]);
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'media',
                            data: post_tech_images_1.postTechIot,
                            filePath: path_1.default.resolve(__dirname, 'post-iot-1.jpg'),
                        })];
                case 9:
                    _h = _h.concat([
                        _u.sent()
                    ]);
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'media',
                            data: post_tech_images_1.postTechQuant,
                            filePath: path_1.default.resolve(__dirname, 'post-quant-1.jpg'),
                        })];
                case 10:
                    _h = _h.concat([
                        _u.sent()
                    ]);
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'media',
                            data: post_news_images_1.postNews2,
                            filePath: path_1.default.resolve(__dirname, 'post-news-2.jpg'),
                        })];
                case 11:
                    _h = _h.concat([
                        _u.sent()
                    ]);
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'media',
                            data: post_news_images_1.postNewsHope,
                            filePath: path_1.default.resolve(__dirname, 'post-hope-2.jpg'),
                        })];
                case 12:
                    _h = _h.concat([
                        _u.sent()
                    ]);
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'media',
                            data: post_news_images_1.postNewsDest,
                            filePath: path_1.default.resolve(__dirname, 'post-destination-2.jpg'),
                        })];
                case 13:
                    _h = _h.concat([
                        _u.sent()
                    ]);
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'media',
                            data: post_finance_images_1.postFinance3,
                            filePath: path_1.default.resolve(__dirname, 'post-finance-3.jpg'),
                        })];
                case 14:
                    _h = _h.concat([
                        _u.sent()
                    ]);
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'media',
                            data: post_finance_images_1.postFinanceStocks,
                            filePath: path_1.default.resolve(__dirname, 'post-stocks-3.jpg'),
                        })];
                case 15:
                    _h = _h.concat([
                        _u.sent()
                    ]);
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'media',
                            data: post_finance_images_1.postFinanceBuildings,
                            filePath: path_1.default.resolve(__dirname, 'post-buildings-3.jpg'),
                        })];
                case 16:
                    _h = _h.concat([
                        _u.sent()
                    ]);
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'media',
                            data: project_design_images_1.projectDesign,
                            filePath: path_1.default.resolve(__dirname, 'project-design.jpg'),
                        })];
                case 17:
                    _h = _h.concat([
                        _u.sent()
                    ]);
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'media',
                            data: project_design_images_1.projectDesign2,
                            filePath: path_1.default.resolve(__dirname, 'project-design-2.jpg'),
                        })];
                case 18:
                    _h = _h.concat([
                        _u.sent()
                    ]);
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'media',
                            data: project_design_images_1.projectDesign3,
                            filePath: path_1.default.resolve(__dirname, 'project-design-3.jpg'),
                        })];
                case 19:
                    _h = _h.concat([
                        _u.sent()
                    ]);
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'media',
                            data: project_software_images_1.projectSoftware,
                            filePath: path_1.default.resolve(__dirname, 'project-software-1.jpg'),
                        })];
                case 20:
                    _h = _h.concat([
                        _u.sent()
                    ]);
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'media',
                            data: project_software_images_1.projectSoftware2,
                            filePath: path_1.default.resolve(__dirname, 'project-software-2.jpg'),
                        })];
                case 21:
                    _h = _h.concat([
                        _u.sent()
                    ]);
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'media',
                            data: project_software_images_1.projectSoftware3,
                            filePath: path_1.default.resolve(__dirname, 'project-software-3.jpg'),
                        })];
                case 22:
                    _h = _h.concat([
                        _u.sent()
                    ]);
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'media',
                            data: project_software_images_1.projectSoftware4,
                            filePath: path_1.default.resolve(__dirname, 'project-software-4.jpg'),
                        })];
                case 23:
                    _h = _h.concat([
                        _u.sent()
                    ]);
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'media',
                            data: project_eng_images_1.projectEng,
                            filePath: path_1.default.resolve(__dirname, 'project-eng-1.jpg'),
                        })];
                case 24:
                    _h = _h.concat([
                        _u.sent()
                    ]);
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'media',
                            data: project_eng_images_1.projectEng2,
                            filePath: path_1.default.resolve(__dirname, 'project-eng-2.jpg'),
                        })];
                case 25:
                    _h = _h.concat([
                        _u.sent()
                    ]);
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'media',
                            data: project_eng_images_1.projectEng3,
                            filePath: path_1.default.resolve(__dirname, 'project-eng-3.jpg'),
                        })];
                case 26:
                    _h = _h.concat([
                        _u.sent()
                    ]);
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'media',
                            data: project_eng_images_1.projectEng4,
                            filePath: path_1.default.resolve(__dirname, 'project-eng-4.jpg'),
                        })];
                case 27: return [4 /*yield*/, _g.apply(_f, [_h.concat([
                            _u.sent()
                        ])])];
                case 28:
                    _e = _u.sent(), image1Doc = _e[0], image2Doc = _e[1], imageSpheresDoc = _e[2], postImage1Doc = _e[3], postTechAi1Doc = _e[4], postTechIot1Doc = _e[5], postTechQuant1Doc = _e[6], postImage2Doc = _e[7], postNewsHope2Doc = _e[8], postNewsDest2Doc = _e[9], postImage3Doc = _e[10], postFinanceStocks3Doc = _e[11], postFinanceBuildings3Doc = _e[12], projectDesignDoc = _e[13], projectDesign2Doc = _e[14], projectDesign3Doc = _e[15], projectSoftwareDoc = _e[16], projectSoftware2Doc = _e[17], projectSoftware3Doc = _e[18], projectSoftware4Doc = _e[19], projectEngDoc = _e[20], projectEng2Doc = _e[21], projectEng3Doc = _e[22], projectEng4Doc = _e[23];
                    payload_1.default.logger.info("\u2014 Seeding categories...");
                    _l = (_k = Promise).all;
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'categories',
                            data: {
                                title: 'Technology',
                            },
                        })];
                case 29:
                    _m = [
                        _u.sent()
                    ];
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'categories',
                            data: {
                                title: 'News',
                            },
                        })];
                case 30:
                    _m = _m.concat([
                        _u.sent()
                    ]);
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'categories',
                            data: {
                                title: 'Finance',
                            },
                        })];
                case 31:
                    _m = _m.concat([
                        _u.sent()
                    ]);
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'categories',
                            data: {
                                title: 'Design',
                            },
                        })];
                case 32:
                    _m = _m.concat([
                        _u.sent()
                    ]);
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'categories',
                            data: {
                                title: 'Software',
                            },
                        })];
                case 33:
                    _m = _m.concat([
                        _u.sent()
                    ]);
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'categories',
                            data: {
                                title: 'Engineering',
                            },
                        })];
                case 34: return [4 /*yield*/, _l.apply(_k, [_m.concat([
                            _u.sent()
                        ])])];
                case 35:
                    _j = _u.sent(), technologyCategory = _j[0], newsCategory = _j[1], financeCategory = _j[2], designCat = _j[3], softwareCat = _j[4], engineeringCat = _j[5];
                    payload_1.default.logger.info("\u2014 Seeding posts...");
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'posts',
                            data: JSON.parse(JSON.stringify(__assign(__assign({}, post_1_1.post1), { categories: [technologyCategory.id] }))
                                .replace(/\{\{IMAGE-1\}\}/g, postImage1Doc.id)
                                .replace(/\{\{IMAGE-2\}\}/g, postTechAi1Doc.id)
                                .replace(/\{\{IMAGE-3\}\}/g, postTechIot1Doc.id)
                                .replace(/\{\{IMAGE-4\}\}/g, postTechQuant1Doc.id)
                                .replace(/\{\{AUTHOR\}\}/g, demoAuthorID)),
                        })];
                case 36:
                    post1Doc = _u.sent();
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'posts',
                            data: JSON.parse(JSON.stringify(__assign(__assign({}, post_2_1.post2), { categories: [newsCategory.id] }))
                                .replace(/\{\{IMAGE-1\}\}/g, postImage2Doc.id)
                                .replace(/\{\{IMAGE-2\}\}/g, postNewsHope2Doc.id)
                                .replace(/\{\{IMAGE-3\}\}/g, postNewsDest2Doc.id)
                                .replace(/\{\{AUTHOR\}\}/g, demoAuthorID)),
                        })];
                case 37:
                    post2Doc = _u.sent();
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'posts',
                            data: JSON.parse(JSON.stringify(__assign(__assign({}, post_3_1.post3), { categories: [financeCategory.id] }))
                                .replace(/\{\{IMAGE-1\}\}/g, postImage3Doc.id)
                                .replace(/\{\{IMAGE-2\}\}/g, postFinanceStocks3Doc.id)
                                .replace(/\{\{IMAGE-3\}\}/g, postFinanceBuildings3Doc.id)
                                .replace(/\{\{AUTHOR\}\}/g, demoAuthorID)),
                        })];
                case 38:
                    post3Doc = _u.sent();
                    posts = [post1Doc, post2Doc, post3Doc];
                    _p = (_o = Promise).all;
                    return [4 /*yield*/, payload_1.default.update({
                            id: post1Doc.id,
                            collection: 'posts',
                            data: {
                                relatedPosts: [post2Doc.id, post3Doc.id],
                            },
                        })];
                case 39:
                    _q = [
                        _u.sent()
                    ];
                    return [4 /*yield*/, payload_1.default.update({
                            id: post2Doc.id,
                            collection: 'posts',
                            data: {
                                relatedPosts: [post1Doc.id, post3Doc.id],
                            },
                        })];
                case 40:
                    _q = _q.concat([
                        _u.sent()
                    ]);
                    return [4 /*yield*/, payload_1.default.update({
                            id: post3Doc.id,
                            collection: 'posts',
                            data: {
                                relatedPosts: [post1Doc.id, post2Doc.id],
                            },
                        })];
                case 41: 
                // update each post with related posts
                return [4 /*yield*/, _p.apply(_o, [_q.concat([
                            _u.sent()
                        ])])];
                case 42:
                    // update each post with related posts
                    _u.sent();
                    payload_1.default.logger.info("\u2014 Seeding comments...");
                    return [4 /*yield*/, Promise.all(posts.map(function (post) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, payload_1.default.create({
                                            collection: 'comments',
                                            data: {
                                                _status: 'published',
                                                comment: "This is a comment on post: ".concat(post.title, ". It has been approved by an admin and is now visible to the public. You can leave your own comment on this post using the form below."),
                                                doc: post.id,
                                                user: demoUserID,
                                            },
                                        })];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); }))];
                case 43:
                    _u.sent();
                    payload_1.default.logger.info("\u2014 Seeding projects...");
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'projects',
                            data: JSON.parse(JSON.stringify(__assign(__assign({}, project_1_1.project1), { categories: [designCat.id] }))
                                .replace(/\{\{IMAGE\}\}/g, projectDesignDoc.id)
                                .replace(/\{\{IMAGE-2\}\}/g, projectDesign2Doc.id)
                                .replace(/\{\{IMAGE-3\}\}/g, projectDesign3Doc.id)
                                .replace(/\{\{IMAGE-SPHERE\}\}/g, imageSpheresDoc.id)),
                        })];
                case 44:
                    project1Doc = _u.sent();
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'projects',
                            data: JSON.parse(JSON.stringify(__assign(__assign({}, project_2_1.project2), { categories: [softwareCat.id] }))
                                .replace(/\{\{IMAGE-1\}\}/g, projectSoftwareDoc.id)
                                .replace(/\{\{IMAGE-2\}\}/g, projectSoftware2Doc.id)
                                .replace(/\{\{IMAGE-3\}\}/g, projectSoftware3Doc.id)
                                .replace(/\{\{IMAGE-4\}\}/g, projectSoftware4Doc.id)),
                        })];
                case 45:
                    project2Doc = _u.sent();
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'projects',
                            data: JSON.parse(JSON.stringify(__assign(__assign({}, project_3_1.project3), { categories: [engineeringCat.id] }))
                                .replace(/\{\{IMAGE-1\}\}/g, projectEngDoc.id)
                                .replace(/\{\{IMAGE-2\}\}/g, projectEng2Doc.id)
                                .replace(/\{\{IMAGE-3\}\}/g, projectEng3Doc.id)
                                .replace(/\{\{IMAGE-4\}\}/g, projectEng4Doc.id)),
                        })
                        // update each project with related projects
                    ];
                case 46:
                    project3Doc = _u.sent();
                    _s = (_r = Promise).all;
                    return [4 /*yield*/, payload_1.default.update({
                            id: project1Doc.id,
                            collection: 'projects',
                            data: {
                                relatedProjects: [project2Doc.id, project3Doc.id],
                            },
                        })];
                case 47:
                    _t = [
                        _u.sent()
                    ];
                    return [4 /*yield*/, payload_1.default.update({
                            id: project2Doc.id,
                            collection: 'projects',
                            data: {
                                relatedProjects: [project1Doc.id, project3Doc.id],
                            },
                        })];
                case 48:
                    _t = _t.concat([
                        _u.sent()
                    ]);
                    return [4 /*yield*/, payload_1.default.update({
                            id: project3Doc.id,
                            collection: 'projects',
                            data: {
                                relatedProjects: [project1Doc.id, project2Doc.id],
                            },
                        })];
                case 49: 
                // update each project with related projects
                return [4 /*yield*/, _s.apply(_r, [_t.concat([
                            _u.sent()
                        ])])];
                case 50:
                    // update each project with related projects
                    _u.sent();
                    payload_1.default.logger.info("\u2014 Seeding posts page...");
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'pages',
                            data: JSON.parse(JSON.stringify(posts_page_1.postsPage).replace(/\{\{IMAGE\}\}/g, image1Doc.id)),
                        })];
                case 51:
                    postsPageID = (_u.sent()).id;
                    payload_1.default.logger.info("\u2014 Seeding projects page...");
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'pages',
                            data: JSON.parse(JSON.stringify(projects_page_1.projectsPage).replace(/\{\{IMAGE\}\}/g, image1Doc.id)),
                        })];
                case 52:
                    projectsPageID = (_u.sent()).id;
                    payload_1.default.logger.info("\u2014 Seeding home page...");
                    return [4 /*yield*/, payload_1.default.create({
                            collection: 'pages',
                            data: JSON.parse(JSON.stringify(home_1.home)
                                .replace(/\{\{IMAGE_1\}\}/g, image1Doc.id)
                                .replace(/\{\{IMAGE_2\}\}/g, image2Doc.id)
                                .replace(/\{\{POSTS_PAGE_ID\}\}/g, postsPageID)
                                .replace(/\{\{PROJECTS_PAGE_ID\}\}/g, projectsPageID)),
                        })];
                case 53:
                    _u.sent();
                    payload_1.default.logger.info("\u2014 Seeding settings...");
                    return [4 /*yield*/, payload_1.default.updateGlobal({
                            data: {
                                postsPage: postsPageID,
                                projectsPage: projectsPageID,
                            },
                            slug: 'settings',
                        })];
                case 54:
                    _u.sent();
                    payload_1.default.logger.info("\u2014 Seeding header...");
                    return [4 /*yield*/, payload_1.default.updateGlobal({
                            data: {
                                navItems: [
                                    {
                                        link: {
                                            label: 'Posts',
                                            reference: {
                                                relationTo: 'pages',
                                                value: postsPageID,
                                            },
                                            type: 'reference',
                                        },
                                    },
                                    {
                                        link: {
                                            label: 'Projects',
                                            reference: {
                                                relationTo: 'pages',
                                                value: projectsPageID,
                                            },
                                            type: 'reference',
                                        },
                                    },
                                ],
                            },
                            slug: 'header',
                        })];
                case 55:
                    _u.sent();
                    return [4 /*yield*/, payload_1.default.updateGlobal({
                            data: {
                                navItems: [
                                    {
                                        link: {
                                            label: 'Account',
                                            reference: undefined,
                                            type: 'custom',
                                            url: '/account',
                                        },
                                    },
                                ],
                            },
                            slug: 'footer',
                        })];
                case 56:
                    _u.sent();
                    payload_1.default.logger.info('Seeded database successfully!');
                    return [2 /*return*/];
            }
        });
    });
}
exports.seedDB = seedDB;
