exports.exec = function (req, host_res, knex, res) {
    const setting = require('./../../models/setting/setting');
    setting.get(knex, {}).then(function (setting) {
        req.app.locals.render(req, host_res, 'pages/admin/setting', {
            setting: setting,
            res: res
        });
    }, function (e) {
        host_res.render('pages/error', {error: e});
    });
};

exports.update = function (req, host_res, knex) {
    const setting = require('./../../models/setting/setting');
    const condition = req.body ? req.body : {};
    const validation = require('./../../validation/setting');
    const session_message = require('./../../libs/express/session_message');
    let valid_condition = validation.setting(condition);
    if (!valid_condition) {
        host_res.render('pages/error', {error: {message: '更新条件が正しく設定されておりません'}});
    }
    setting.update(knex, valid_condition).then(function (res) {
        session_message.set_message(req, '更新しました。');
        host_res.redirect('/admin/setting');
    }, function (e) {
        host_res.render('pages/error', {error: e});
    });
};