const async = require('async');
const shell_exec = require('child_process').exec;
const tables = [
    'users',
    'admin_users',
    'setting',
    'message_send_status',
    'scraping_user_info_status',
    'knex_migrations',
    'knex_migrations_lock'
];
exports.create_db = async function (config) {
    return new Promise(function (resolve, reject) {
        const pgtools = require('pgtools');
        pgtools.createdb({
          user: config.connection.user,
          password: config.connection.password,
          host: config.connection.host
        }, config.connection.database, function (err, res) {
          if (err) {
            reject(err);
          }
          resolve(true)
        });
    });
};

exports.drop = function (knex) {
    return new Promise(function (resolve, reject) {
        async.each(tables, function (table, callback) {
            knex.schema.dropTableIfExists(table).catch(function (err) {
                throw(err);
            });
            callback();
        }, function (err) {
            if (err) {
                reject(err);
            }
            resolve(true)
        });
    });
};
exports.create = function (env) {
    return new Promise(function (resolve, reject) {
        shell_exec(`knex migrate:latest --env ${env}`, function(err, stdout, stderr){
            if(err){
                reject(err)
            }
            resolve(true)
        });
    });
};

exports.init = function (env) {
    return new Promise(function (resolve, reject) {
        shell_exec(`knex seed:run --env ${env}`, function(err, stdout, stderr){
            if(err){
                reject(err)
            }
            resolve(true)
        });
    });
};
