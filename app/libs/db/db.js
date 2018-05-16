const exec = require('child_process').exec;
const async = require('async');

exports.dump = function (req, env) {
    const moment = require("moment");
    const dump_path = req.app.locals.dirname + '/app/db/seeds/dump/dump.' + moment().unix();
    return new Promise(function (resolve, reject) {
        let db_name = 'scraping' + (env === 'production'? '-pro' : '-dev');
        exec('pg_dump -U postgres -Fc ' + db_name + ' > ' + dump_path, function (err, stdout, stderr) {
            if (err) {
                reject(err);
            }
            resolve(true);
        });
    });
};

exports.restore = function (req, env) {
    let file_name = '';
    if (req.query.file_name) {
        file_name = req.query.file_name;
    }
    const dump_path = req.app.locals.dirname + '/app/db/seeds/dump/' + file_name;
    return new Promise(function (resolve, reject) {
        let db_name = 'scraping' + (env === 'production'? '-pro' : '-dev');
        exec('pg_restore -U postgres -c -d ' + db_name + ' ' + dump_path, function (err, stdout, stderr) {
            if (err) {
                reject(err);
            }
            resolve(true);
        });
    });
};

exports.delete_backup = function (req) {
    let file_name = '';
    if (req.query.file_name) {
        file_name = req.query.file_name;
    }
    return new Promise(function (resolve, reject) {
        const dir = './app/db/seeds/dump/';
        const fs = require('fs');

        fs.unlink(dir + file_name, (err, res) => {
            if (err) {
                reject(err)
            }
            resolve(true)
        });
    });
};

exports.delete_csv = function (req) {
    let file_name = '';
    if (req.query.file_name) {
        file_name = req.query.file_name;
    }
    return new Promise(function (resolve, reject) {
        const dir = './public/csv/';
        const fs = require('fs');

        fs.unlink(dir + file_name, (err, res) => {
            if (err) {
                reject(err)
            }
            resolve(true)
        });
    });
};

exports.csv = function (knex, req) {
    const search_condition = require('../../config/search_condition.json');
    const moment = require("moment");
    const createCsvWriter = require('csv-writer').createObjectCsvWriter;
    return new Promise(function (resolve, reject) {

        knex.select('*').from('users').then(function (rows) {
            rows.forEach(function (row) {
                row.registered_at = moment(row.registered_at).format("YYYY-MM-DD");
                row.created_at = moment(row.created_at).format("YYYY-MM-DD");
                row.update_at = moment(row.update_at).format("YYYY-MM-DD");
            });
            let headers = [];
            Object.keys(search_condition.titles).forEach(function (key) {
                headers.push({id: key, title: search_condition.titles[key]})
            });
            const csvWriter = createCsvWriter({
                path: req.app.locals.dirname + "/public/csv/users_" + moment().unix() + ".csv",
                header: headers
            });
            csvWriter.writeRecords(rows)
                .then(() => {
                    resolve(true)
                });
        }).catch(function (err) {
            reject(err);
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
        exec(`knex migrate:latest --env ${env}`, function (err, stdout, stderr) {
            if (err) {
                reject(err)
            }
            resolve(true)
        });
    });
};

exports.init = function (env) {
    return new Promise(function (resolve, reject) {
        exec(`knex seed:run --env ${env}`, function (err, stdout, stderr) {
            if (err) {
                reject(err)
            }
            resolve(true)
        });
    });
};

exports.start_db = function () {
    return new Promise(function (resolve, reject) {
        exec(`pg_ctl -D /usr/local/var/postgres start`, function (err, stdout, stderr) {
            if (err) {
                reject(err)
            }
            resolve(true)
        });
    });
};

exports.stop_db = function () {
    return new Promise(function (resolve, reject) {
        exec(`pg_ctl -D /usr/local/var/postgres stop`, function (err, stdout, stderr) {
            if (err) {
                reject(err)
            }
            resolve(true)
        });
    });
};

exports.backup_list = function () {
    return new Promise(function (resolve, reject) {
        const dir = './app/db/seeds/dump';
        const fs = require('fs');
        const moment = require('moment');

        let backup_list = [];
        fs.readdir(dir, (err, files) => {
            if(!files) resolve([]);
            for (let file_name of files) {
                const timestamp = file_name.replace('dump.', '');
                const date_str = moment.unix(timestamp).format("YYYY年MM月DD日 HH:mm:ssZ");
                backup_list.push({date_str: date_str, file_name: file_name});
            }
            resolve(backup_list.reverse())
        });
    });
};

exports.csv_list = function () {
    return new Promise(function (resolve, reject) {
        const dir = './public/csv';
        const fs = require('fs');
        const moment = require('moment');

        let csv_list = [];
        fs.readdir(dir, (err, files) => {
            if(!files) resolve([]);
            for (let file_name of files) {
                const timestamp = file_name.replace('users_', '').replace('.csv', '');
                const date_str = moment.unix(timestamp).format("YYYY年MM月DD日 HH:mm:ssZ");
                csv_list.push({date_str: date_str, file_name: file_name});
            }
            resolve(csv_list.reverse())
        });
    });
};


