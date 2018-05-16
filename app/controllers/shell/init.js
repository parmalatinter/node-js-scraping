exports.db_init = function (config, env) {
    const db = require("./../../libs/db/db");
    db.create_db(config).then(function () {
        db.create(env).then(function (e) {
            db.init(env).then(function () {
                console.log(`データベース初期化しました。下記コマンドを実施してください`);
                console.log(`SET NODE_ENV=production or NODE_ENV=development`);
                console.log(`npm start`);
            }).catch(function (e) {
                console.log(`データベースエラー`, e);
            });
        }).catch(function (e) {
            console.log(`データベースエラー`, e);
        });
    }).catch(function (e) {
        console.log(`データベース起動しました。 下記コマンドを実施してください`);
        console.log(`SET NODE_ENV=production or NODE_ENV=development`);
        console.log(`npm start`);
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