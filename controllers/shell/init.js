exports.db_init = function (config, env) {
    return new Promise(function (resolve, reject) {
        const db = require("./../../libs/db/reset");
        db.create_db(config).then(function () {
            db.create(env).then(function (e) {
                db.init(env).then(function () {
                    resolve(true);
                }).catch(function (e) {
                    reject(e);
                });
            }).catch(function (e) {
               reject(e);
            });
        }).catch(function (e) {
            reject(e);
        });
    });
};

exports.db_restart = function () {
    return new Promise(function (resolve, reject) {
        const db = require("./../../libs/db/reset");
        db.stop_db().then(function () {
            db.start_db().then(function (e) {
                resolve(true);
            }).catch(function (e) {
                reject(e);
            });
        }).catch(function (e) {
            reject(e);
        });
    });
};