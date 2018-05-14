const exec = require('child_process').exec;
exports.dump = function (req) {
    const moment = require("moment");
    const dump_path = req.app.locals.dirname + '/seeds/dump/dump.' + moment().unix();
    return new Promise(function (resolve, reject) {
        exec('pg_dump  -C -U postgres scraping ' + '> ' + dump_path, function (err, stdout, stderr) {
            if (err) {
                reject(err)
            }
            resolve(true)
        });
    });
};

exports.restore = function (req) {
    let file_name = '';
    if (req.query.file_name) {
        file_name = req.query.file_name;
    }
    const dump_path = req.app.locals.dirname + '/seeds/dump/' + file_name;
    return new Promise(function (resolve, reject) {
        console.log('pg_dump -Fc -U postgres scraping ' + '> ' + dump_path);
        exec('pg_dump -Fc -U postgres scraping ' + '> ' + dump_path, function (err, stdout, stderr) {
            if (err) {
                reject(err)
            }
            resolve(true)
        });
    });
};

exports.delete = function (req) {
    let file_name = '';
    if (req.query.file_name) {
        file_name = req.query.file_name;
    }
    return new Promise(function (resolve, reject) {
        const dir = './seeds/dump/';
        const fs = require('fs');

        fs.unlink(dir + file_name, (err, res) => {
            if (err) {
                reject(err)
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
            pg.connect(function (err, client, done) {
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

const async = require('async');

exports.drop = function (knex) {
    const tables = [
        'users',
        'admin_users',
        'setting',
        'message_send_status',
        'scraping_user_info_status',
        'knex_migrations',
        'knex_migrations_lock'
    ];
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
        shell_exec(`knex migrate:latest --env ${env}`, function (err, stdout, stderr) {
            if (err) {
                reject(err)
            }
            resolve(true)
        });
    });
};

exports.init = function (env) {
    return new Promise(function (resolve, reject) {
        shell_exec(`knex seed:run --env ${env}`, function (err, stdout, stderr) {
            if (err) {
                reject(err)
            }
            resolve(true)
        });
    });
};

exports.start_db = function () {
    return new Promise(function (resolve, reject) {
        shell_exec(`pg_ctl -D /usr/local/var/postgres start`, function (err, stdout, stderr) {
            if (err) {
                reject(err)
            }
            resolve(true)
        });
    });
};

exports.stop_db = function () {
    return new Promise(function (resolve, reject) {
        shell_exec(`pg_ctl -D /usr/local/var/postgres stop`, function (err, stdout, stderr) {
            if (err) {
                reject(err)
            }
            resolve(true)
        });
    });
};

