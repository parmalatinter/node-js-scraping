const async = require("async");
const admin_user = require("../../models/admin/user");
const user_info = require("../../libs/puppeteer/user_info");
const scraping_user_info_status = require('../../models/status/scraping_user_info_status');
const setting = require("../../models/setting/setting");
const session_message = require('../../../libs/express/session_message');

exports.exec = function (req, knex, puppeteer, env) {
    (async (req, knex, puppeteer, env) => {
        const setting_row = await setting.get(knex);
        let running_type = scraping_user_info_status.running_type_configs.running;
        scraping_user_info_status.update_running_type(knex, running_type);

        admin_user.get_enable_list(knex).then(function (user_records) {
            async.each(user_records, function (user_record, callback) {
                user_info.exec(puppeteer, knex, user_record, setting_row, env).then(function (info_count) {
                    callback();
                    console.log('got info ' + info_count)
                }).catch(function (e) {
                    if (e) {
                        throw e;
                    }
                });
            }, function (e) {
                if(e){
                    session_message.set_error_message(req, e, '収集エラー');
                }else{
                    session_message.set_message(req, '収集完了');
                }
                console.log('scraping user info finished');
                running_type = scraping_user_info_status.running_type_configs.stopping;
                scraping_user_info_status.update_running_type(knex, running_type);
            });
        }).catch(function (e) {
            session_message.set_error_message(req, e, '収集エラー');
            running_type = scraping_user_info_status.running_type_configs.stopping;
            scraping_user_info_status.update_running_type(knex, running_type);
        });

    })(req, knex, puppeteer, env);
};