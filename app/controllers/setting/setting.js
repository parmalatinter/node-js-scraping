exports.exec = function (req, host_res, knex) {
    const setting = require('../../models/setting/setting');
    setting.get(knex).then(function (res) {
        host_res.render('pages/setting', {setting: setting})
    }, function (e) {
        host_res.render('pages/error', {error: e});
    });
};