exports.get = function (knex) {
    return new Promise(function (resolve, reject) {
        knex.schema.hasTable('knex_migrations').then(function(exists) {
          resolve({res : true});
        }).catch(function (err) {
           reject({res : false, err :err});
        });
    });
};