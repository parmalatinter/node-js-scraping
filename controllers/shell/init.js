exports.exec = function (config, env) {
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