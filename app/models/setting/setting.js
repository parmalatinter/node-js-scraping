const id = 1;

exports.get= function (knex) {
    return new Promise(function (resolve, reject) {
        knex.select('*').where({id : id}).from('setting').then(function (rows) {
            if (rows.length === 0) {
                resolve(null);
            } else {
                resolve(rows[0]);
            }
        }).catch(function (err) {
            reject(err);
        });
    });
};

exports.update = function (knex, condition) {
    return new Promise(function (resolve, reject) {
        knex('setting').where('id', id).update(condition).then(function () {
            resolve(true);
        }).catch(function (err) {
            reject(err);
        });
    });
};

exports.get_frequency_minute= function (knex) {
    return new Promise(function (resolve, reject) {
        knex.select('message_send_frequency_minute').where({id : id}).from('setting').then(function (rows) {
            if (rows.length === 0) {
                resolve(null);
            } else {
                resolve(rows[0].message_send_frequency_minute);
            }
        }).catch(function (err) {
            reject(err);
        });
    });
};

exports.update_message_send_frequency_minute = function (knex, message_send_frequency_minute) {
    return new Promise(function (resolve, reject) {
        knex("setting").where("id", id)
            .update({
                message_send_frequency_minute: message_send_frequency_minute
            }).catch(function (err) {
            throw(err);
        })
        .then(function () {
            resolve(true);
        }).catch(function (err) {
            reject(err);
        });
    })
};

exports.is_headless_mode = function (knex) {
    return new Promise(function (resolve, reject) {
        knex.select("is_headless_mode").from("setting").where({"id": id}).limit(1).then(function (rows) {
            if (rows.length === 0) {
                resolve(false);
            } else {
                for (let row of rows) {
                    resolve(row.is_headless_mode ? true : false);
                }
            }
        }).catch(function (err) {
            reject(err);
        });
    });
};