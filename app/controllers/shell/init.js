exports.db_init = function (config, env) {
    const db = require("./../../libs/db/db");
    console.log(config);
    db.create_db(config).then(function () {
        db.create(env).then(function () {
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
    const db = require("./../../libs/db/db");
    db.stop_db().then(function () {
        db.start_db().then(function () {
            console.log(`データベース再起動しました。 下記コマンドを実施してください`);
            console.log(`SET NODE_ENV=production or NODE_ENV=development`);
            console.log(`npm start`);
        }).catch(function (e) {
            console.log(`データベースエラー`, e);
        });
    }).catch(function (e) {
        db.start_db().then(function () {
            console.log(`データベース再起動しました。 下記コマンドを実施してください`);
            console.log(`SET NODE_ENV=production or NODE_ENV=development`);
            console.log(`npm start`);
        }).catch(function (e) {
            console.log(`データベースエラー`, e);
        });
    });
};