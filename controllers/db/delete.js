const session_message = require('./../../libs/express/session_message');
exports.exec = function (req, host_res) {
    const delete_backup = require('./../../libs/db/backup');
    delete_backup.delete(req).then(function (result) {
        session_message.set_message(req, '削除しました。');
        host_res.redirect('/admin/db');
    }, function (e) {
        req.app.locals.render(req, host_res, 'pages/error', {error: e});
    });
};