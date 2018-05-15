exports.exec = function (req, host_res, path, data) {
    const setting = require('../../models/setting/setting');
    data.message = req.session.message;
    data.error_message = req.session.error_message;
    data.error =  req.session.error;
    req.session.message = '';
    req.session.error_message = '';
    req.session.error = '';

    setting.get(req.app.locals.knex).then(function (row) {
        data.stting = row;
        host_res.render(path, data);
    }).catch(function (e) {
        host_res.render('pages/error', {error: e});
    });
};