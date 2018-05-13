exports.get_enable_list = function (knex) {
    return exports.get_list(knex, {is_enable: true});
};
exports.get_list = function (knex, conditon) {
    return new Promise(function (resolve, reject) {
        conditon = Object.keys(conditon) ? conditon : {};
        knex.select('*').where(conditon).from('admin_users').orderBy('id', 'desc').then(function (rows) {
            if (rows.length === 0) {
                resolve([]);
            } else {
                resolve(rows);
            }
        }).catch(function (err) {
            reject(err);
        });
    });
};
exports.insert = function (knex, user_obj) {
    return new Promise(function (resolve, reject) {
        knex.insert(user_obj)
            .returning('id')
            .into('admin_users').then(function () {
            resolve(true);
        }).catch(function (err) {
            reject(err)
        });
    });
};

exports.update = function (knex, id, condition) {
    return new Promise(function (resolve, reject) {
        knex('admin_users').where('id', id).update(condition).then(function () {
            resolve(true);
        }).catch(function (err) {
            reject(err);
        });
    });
};
exports.delete = function (knex, id) {
    return new Promise(function (resolve, reject) {
        knex("admin_users").where("id", id).delete().then(function () {
            resolve(true);
        }).catch(function (err) {
            reject(err);
        });
    });
};