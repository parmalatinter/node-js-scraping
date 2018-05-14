const session_message = require('./../../libs/express/session_message');
const output_error = require('./../error/error');
const db = require('../../libs/db/db');

exports.backup = function (req, host_res) {
    db.dump(req).then(function (result) {
        session_message.set_message(req, 'バックアップしました。');
        host_res.redirect('/admin/db');
    }, function (e) {
        req.app.locals.render(req, host_res, 'pages/error', {error: e});
    });
};

exports.backup_list = function (req, host_res) {
    const dir = './seeds/dump';
    const fs = require('fs');
    const moment = require('moment');

    let backup_list = [];
    fs.readdir(dir, (err, files) => {
        for(let file_name of files){
            const timestamp = file_name.replace('dump.', '');
            const date_str = moment.unix(timestamp).format("YYYY年MM月DD日 HH:mm:ssZ");
            backup_list.push({date_str: date_str, file_name : file_name});
        }
        req.app.locals.render(req, host_res, 'pages/admin/db', {backup_list: backup_list.reverse()});
    });
};

exports.delete_backup = function (req, host_res) {
    db.delete(req).then(function (result) {
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