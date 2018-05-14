exports.exec = async function (host_res, knex, puppeteer, env) {
    const async = require("async");
    const admin_user = require("./../../models/admin/user");
    const user_info = require("./../../libs/puppeteer/user_info");
    const scraping_user_info_status = require('./../../models/status/scraping_user_info_status');
    const setting = require("../../models/setting/setting");
    const setting_row = await setting.get(knex);
    let running_type = scraping_user_info_status.running_type_configs.running;
    scraping_user_info_status.update_running_type(knex, running_type);

    admin_user.get_enable_list(knex).then(function (user_records) {
        async.each(user_records, function (user_record, callback) {
            user_info.exec(puppeteer, knex, user_record, setting_row, env).then(function (info_count) {
                callback();
                console.log('got infos ' + info_count)
            }).catch(function (e) {
                if (e) {
                    throw e;
                }
            });
        }, function (e) {
            running_type = scraping_user_info_status.running_type_configs.stopping;
            scraping_user_info_status.update_running_type(knex, running_type);
            console.log('scraping user info finished');
            if (e) {
                throw(e);
            }
            return true;
        });
    }).catch(function () {
        running_type = scraping_user_info_status.running_type_configs.stopping;
        scraping_user_info_status.update_running_type(knex, running_type);
        return true;
    });
};