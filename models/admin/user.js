exports.get_list = function (knex) {
    return new Promise(function (resolve, reject) {
        knex.select('*').where({is_enable: true}).from('admin_users').then(function (rows) {
            if (rows.length === 0) {
                resolve([]);
            } else {
                resolve(rows);
            }
        }).catch(function (err) {/**/
            reject(err);
        });
    });
};
exports.update = function (knex, id, condition) {
    return new Promise(function (resolve, reject) {
        knex('admin_users').where('id', id).update(condition)
            .then(function () {
                resolve(true);
            }).catch(function (err) {
            reject(err);
        });
    });
};