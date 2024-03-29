exports.exec = function (req, host_res, path, data) {
    const setting = require('../../models/setting/setting');
    if(!data) data = {};
    data.message = ('message' in req.session) ? req.session.message : '';
    data.error_message = ('message' in req.session) ? req.session.error_message : '';
    data.error = ('error' in req.session) ? req.session.error : {};
    req.session.message = '';
    req.session.error_message = '';
    req.session.error = '';

    setting.get(req.app.locals.knex).then(function (row) {
        data.setting = row;
        host_res.render(path, data);
    }).catch(function (e) {
        host_res.render('pages/error', {error: e});
    });
};