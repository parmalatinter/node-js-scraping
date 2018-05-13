const session_message = require('./../../libs/express/session_message');
let output_error = require('./../error/error');
exports.exec = function (knex, req, host_res, env) {
    const reset = require('./../../libs/db/reset');
    reset.drop(knex).then(function () {
        reset.create(env).then(function () {
            reset.init(env).then(function () {
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