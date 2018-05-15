exports.exec = function (req, host_res, knex) {
    const user = require('../../models/user/user');
    const moment = require("moment");
    const search_condition = require('../../config/search_condition.json');
    const per_page = 20;
    let page = 1;
    if (req.body.page) {
        page = req.body.page;
    }
    if (req.query.page) {
        page = req.query.page;
    }
    const validation = require('../../validation/user');
    let condition = req.body.sort ? req.body : req.session.serch_condition;
    if(!condition) condition = {is_image : 'true', is_enable_send : 'false'};
    const valid_condition = validation.search(condition);
    if (!valid_condition) {
        host_res.render('pages/error', {error: {message: '検索条件が正しく設定されておりません'}});
    }
    let valid_sort = validation.sort(condition);
    let converted_condition = {...valid_condition};
    converted_condition.standard = validation.convert_selects_condition(valid_condition);
    user.get_list(knex, per_page, page, converted_condition, valid_sort).then(function (res) {
        req.session.serch_condition = condition;
        req.app.locals.render(req, host_res, 'pages/admin/users', {
            rows: res.data,
            pagination: res.pagination,
            moment: moment,
            search_condition: search_condition,
            valid_condition: validation.search(condition),
            valid_sort: valid_sort
        })
    }, function (e) {
        host_res.render('pages/error', {error: e});
    });
};

exports.set_is_enable_send = function (req, host_res, knex, is_enable_send) {
    const user = require('../../models/user/user');
    const session_message = require('../../libs/express/session_message');
    const validation = require('../../validation/user');
    const condition = req.body;
    const valid_condition = validation.search(condition);
    if (!valid_condition) {
        host_res.render('pages/error', {error: {message: '検索条件が正しく設定されておりません'}});
    }
    let converted_condition = {...valid_condition};
    converted_condition.standard = validation.convert_selects_condition(valid_condition);
    user.set_is_enable_send(knex, converted_condition, is_enable_send).then(function (res) {
        if(req.session.serch_condition){
            req.session.serch_condition.is_enable_send = 'true';
        }else{
            req.session.serch_condition = {is_enable_send :'true' };
        }
        session_message.set_message(req, '更新しました。');
        host_res.redirect('/admin/user');
    }, function (e) {
        host_res.render('pages/error', {error: e});
    });
};

exports.set_is_enable_send_by_ids = function (req, host_res, knex) {
    const user = require('../../models/user/user');
    const session_message = require('../../libs/express/session_message');
    const condition = req.body;
    const validator = require('validator');
    let converted_true_condition = [];
    let converted_false_condition = [];
    if (!condition.is_enable_send && !condition.is_enable_send.length) {
        host_res.render('pages/error', {error: {message: '条件が正しく設定されておりません'}});
    }
    for (let value of condition.is_enable_send) {
        if (value.includes('true_')) {
            let str = value.replace('true_', '');
            if (value && validator.isInt(str)) converted_true_condition.push(Number(str));
        }
        if (value.includes('false_')) {
            let str = value.replace('false_', '');
            if (value && validator.isInt(str)) converted_false_condition.push(Number(str));
        }
    }
    if (!converted_true_condition.length && !converted_false_condition.length) {
        host_res.render('pages/error', {error: {message: '条件が正しく設定されておりません'}});
    }
    user.set_is_enable_send_by_ids(knex, converted_true_condition, true).then(function (res) {
        user.set_is_enable_send_by_ids(knex, converted_false_condition, false).then(function (res) {
            session_message.set_message(req, '更新しました。');
            host_res.redirect('/admin/user');
        }, function (e) {
            host_res.render('pages/error', {error: e});
        });
    }, function (e) {
        host_res.render('pages/error', {error: e});
    });
};
