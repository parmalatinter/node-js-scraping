const session_message = require('../../libs/express/session_message');

exports.exec = function (req, host_res, knex, res) {
    const user = require('../../models/admin/user');
    const moment = require("moment");
    const search_condition = require('../../config/search_condition.json');
    user.get_list(knex, {}).then(function (rows) {
        req.app.locals.render(req, host_res, 'pages/admin/admin_users', {
            rows: rows,
            moment: moment,
            search_condition: search_condition,
            res: res
        })
    }, function (e) {
        host_res.render('pages/error', {error: e});
    });
};

exports.insert = function (req, host_res, knex) {
    const user = require('../../models/admin/user');
    const validation = require('../../validation/admin_user');
    const condition = req.body ? req.body : {};
    let valid_condition = validation.admin_user(condition);
    if (!valid_condition) {
        host_res.render('pages/error', {error: {message: '値が正しく設定されておりません'}});
    }
    user.insert(knex, condition).then(function (res) {
        session_message.set_message(req, '新規追加しました。');
        host_res.redirect('/admin/admin_user');
    }, function (e) {
        host_res.render('pages/error', {error: e});
    });
};

exports.update = function (req, host_res, knex) {
    const user = require('../../models/admin/user');
    const validation = require('../../validation/admin_user');
    const condition = req.body ? req.body : {};
    let valid_condition = validation.admin_user(condition, false);
    if (!valid_condition) {
        host_res.render('pages/error', {error: {message: '更新条件が正しく設定されておりません'}});
    }
    user.update(knex, condition.id, valid_condition).then(function (res) {
        session_message.set_message(req, '更新追加しました。');
        host_res.redirect('/admin/admin_user');
    }, function (e) {
        host_res.render('pages/error', {error: e});
    });
};

exports.delete = function (req, host_res, knex) {
    const user = require('../../models/admin/user');
    const condition = req.body ? req.body : {};
    const validator = require('validator');
    if (validator.isInt(condition.id)) {
        user.delete(knex, condition.id).then(function () {
            session_message.set_message(req, '新規追加しました。');
            host_res.redirect('/admin/admin_user');
        }, function (e) {
            host_res.render('pages/error', {error: e});
        });
    } else {
        host_res.render('pages/error', {error: {message: 'IDが正しく設定されておりません'}});
    }

};