"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var validations_1 = require("payload/dist/fields/validations");
var admins_1 = require("../../access/admins");
var shared_1 = require("../../cron/shared");
var checkRole_1 = require("./checkRole");
var ensureFirstUserIsAdmin_1 = require("./hooks/ensureFirstUserIsAdmin");
var loginAfterCreate_1 = require("./hooks/loginAfterCreate");
var sanitizeDemoAdmin_1 = require("./hooks/sanitizeDemoAdmin");
var Users = {
    access: {
        admin: function (_a) {
            var user = _a.req.user;
            return (0, checkRole_1.checkRole)(['admin'], user);
        },
        create: function () { return false; },
        delete: function () { return false; },
    },
    admin: {
        defaultColumns: ['name', 'email'],
        useAsTitle: 'name',
    },
    auth: true,
    fields: [
        {
            name: 'name',
            type: 'text',
        },
        {
            // override default email field to add a custom validate function to prevent users from changing the login email
            name: 'email',
            type: 'email',
            validate: function (value, args) {
                var _a;
                if (((_a = args === null || args === void 0 ? void 0 : args.user) === null || _a === void 0 ? void 0 : _a.email) === shared_1.adminEmail && value !== shared_1.adminEmail) {
                    return 'You cannot change the admin password on the public demo!';
                }
                // call the payload default email validation
                return (0, validations_1.email)(value, args);
            },
        },
        {
            name: 'roles',
            access: {
                create: admins_1.admins,
                read: admins_1.admins,
                update: admins_1.admins,
            },
            defaultValue: ['user'],
            hasMany: true,
            hooks: {
                beforeChange: [ensureFirstUserIsAdmin_1.ensureFirstUserIsAdmin],
            },
            options: [
                {
                    label: 'admin',
                    value: 'admin',
                },
                {
                    label: 'user',
                    value: 'user',
                },
            ],
            type: 'select',
        },
    ],
    hooks: {
        afterChange: [loginAfterCreate_1.loginAfterCreate],
        beforeOperation: [sanitizeDemoAdmin_1.sanitizeDemoAdmin],
    },
    slug: 'users',
    timestamps: true,
};
exports.default = Users;
