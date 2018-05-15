const id = 1;
exports.running_type_configs = {
    running : 1,
    stopping : 0
};
exports.update_running_type = function (knex, running_type) {
    return new Promise(function (resolve, reject) {
        knex("scraping_user_info_status").where("id", id)
            .update({
                running_type: running_type
            }).then(function () {
                resolve(true);
            }).catch(function (err) {
                reject(err);
            });
    })
};

exports.get_running_type = function (knex) {
    return new Promise(function (resolve, reject) {
        knex.select("running_type").debug(false).from("scraping_user_info_status").where({"id": id}).limit(1).then(function (rows) {
            if (rows.length === 0) {
                resolve(0);
            } else {
                for (let row of rows) {
                    resolve(row.running_type);
                }
            }
        }).catch(function (err) {
            reject(err);
        });
    });
};