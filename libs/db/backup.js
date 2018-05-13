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