var zipFolder = require('zip-folder');

exports.image_to_zip = function () {
    return new Promise(function (resolve, reject) {
        zipFolder('public/img/user/', 'public/img/users.zip', function (err) {
            if (err) {
                reject(err)
            } else {
                resolve(true)
            }
        });
    });
};

