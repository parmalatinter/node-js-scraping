exports.exec = function (req, host_res, knex) {
    const user = require('./../../models/user/user');
    let per_page = 20;
    if (req.per_page) {
        per_page = req.per_page;
    }
    user.get_list(knex, per_page).then(function (rows) {
        host_res.render('pages/admin/users', {rows: rows})
    });
};