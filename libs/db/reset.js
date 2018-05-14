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

exports.csv = function (knex) {
    return new Promise(function (resolve, reject) {
        const fs = require('fs');
        const pg = require('pg');
        const copyFrom = require('pg-copy-streams').from;
        async.each(tables, function (table, callback) {
            pg.connect(function(err, client, done) {
                let stream = client.query(copyFrom(`COPY my_table FROM ${table} STDIN`));
                let fileStream = fs.createReadStream(`${table}.csv`);
                fileStream.on('error', done);
                stream.on('error', done);
                stream.on('end', done);
                fileStream.pipe(stream);
            });
        }, function (err) {
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

exports.start_db = function () {
    return new Promise(function (resolve, reject) {
        shell_exec(`pg_ctl -D /usr/local/var/postgres start`, function(err, stdout, stderr){
            if(err){
                reject(err)
            }
            resolve(true)
        });
    });
};

exports.stop_db = function () {
    return new Promise(function (resolve, reject) {
        shell_exec(`pg_ctl -D /usr/local/var/postgres stop`, function(err, stdout, stderr){
            if(err){
                reject(err)
            }
            resolve(true)
        });
    });
};



