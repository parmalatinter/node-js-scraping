const session_message = require('./../../libs/express/session_message');
exports.exec = function (req, host_res) {
    const backup = require('./../../libs/db/backup');
    backup.dump(req).then(function (result) {
        session_message.set_message(req, 'バックアップしました。');
        host_res.redirect('/admin/db');
    }, function (e) {
        req.app.locals.render(req, host_res, 'pages/error', {error: e});
    });
};