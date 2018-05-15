const session_message = require('../../libs/express/session_message');
const output_error = require('../error/error');
const db = require('../../libs/db/db');

exports.backup = function (req, host_res) {
    db.dump(req).then(function (result) {
        session_message.set_message(req, 'バックアップしました。');
        host_res.redirect('/admin/db');
    }, function (e) {
        req.app.locals.render(req, host_res, 'pages/error', {error: e});
    });
};
exports.csv = function (knex, req, host_res) {
    db.csv(knex, req).then(function (result) {
        session_message.set_message(req, 'バックアップしました。');
        host_res.redirect('/admin/db');
    }, function (e) {
        req.app.locals.render(req, host_res, 'pages/error', {error: e});
    });
};

exports.backup_list = async function (req, host_res) {
    let backup_list = await db.backup_list();
    let csv_list = await db.csv_list();
    req.app.locals.render(req, host_res, 'pages/admin/db', {backup_list: backup_list, csv_list: csv_list});
};

exports.delete_backup = function (req, host_res) {
    db.delete_backup(req).then(function (result) {
        session_message.set_message(req, '削除しました。');
        host_res.redirect('/admin/db');
    }, function (e) {
        req.app.locals.render(req, host_res, 'pages/error', {error: e});
    });
};

exports.delete_csv = function (req, host_res) {
    db.delete_csv(req).then(function (result) {
        session_message.set_message(req, '削除しました。');
        host_res.redirect('/admin/db');
    }, function (e) {
        req.app.locals.render(req, host_res, 'pages/error', {error: e});
    });
};

exports.reset = function (knex, req, host_res, env) {
    db.drop(knex).then(function () {
        db.create(env).then(function () {
            db.init(env).then(function () {
                session_message.set_message(req, 'リセットしました。');
                host_res.redirect('/admin/db');
            }).catch(function (error) {
                output_error.exec(host_res, error, '初期化に失敗しました');
            });
        }).catch(function (error) {
            output_error.exec(host_res, error, 'DB作成に失敗しました');
        });
    }).catch(function (error) {
        output_error.exec(host_res, error, 'DB削除に失敗しました');
    }, function (e) {
        host_res.render('pages/error', {error: e});
    });
};

exports.restore = function (req, host_res) {
    db.restore(req).then(function (result) {
        session_message.set_message(req, 'レストアしました。');
        host_res.redirect('/admin/db');
    }, function (e) {
        req.app.locals.render(req, host_res, 'pages/error', {error: e});
    });
};