const async = require("async");
const setting = require("../../models/setting/setting");
const message_send_status = require("../../models/status/message_send_status");
exports.exec = function (puppeteer, knex, user_record, send_list) {
    (async (puppeteer, knex, my_user, send_obj, setting_row, env) => {
        let running_type = message_send_status.running_type_configs.running;
        await message_send_status.update_running_type(knex, running_type);
        async.whilst(
            function () {
                return running_type === message_send_status.running_type_configs.running
            },
            function (next) {
                message_send_status.get_running_type(knex).then(function (res) {
                    running_type = res;
                });
                send_message.start(puppeteer, knex, my_user, send_obj, setting_row, env).then(function (res) {
                    if (!res) {
                        running_type = message_send_status.running_type_configs.stopping;
                        message_send_status.update_running_type(knex, running_type);
                        req.app.locals.render(req, host_res, 'pages/error', {error: e});
                    }
                    const sec = 1000;
                    delay(setting_row.frequency_minute * 60 * sec).then(function () {
                        next();
                    })
                }).catch(function (e) {
                    throw e;
                });
            },
            function (e) {
                throw e;
            }
        );
    }, puppeteer, knex, my_user, send_obj, setting_row, env);
}


exports.start = function (host_res, knex, puppeteer, setting_row, env) {
    (async (host_res, knex, puppeteer, setting_row, env) => {

        const admin_user = require('./../../models/admin/user');
        const user = require('./../../models/user/user');
        const send_message = require('./../../libs/puppeteer/send_message');
        const async = require('async');
        const message_send_status = require('./../../models/status/message_send_status');
        let running_type = message_send_status.running_type_configs.running;
        const user_records = await  admin_user.get_enable_list(knex)

        let sent_count = 0;
        async.each(user_records, function (user_record, callback) {
            let target_sex = user_record.sex === 1 ? 2 : 1;
            user.get_enable_send_list(knex, target_sex).then(function (send_list) {
                if (!send_list.length) {
                    callback(true);
                    return;
                }
                exports.exec(puppeteer, knex, user_record, send_list[0], setting_row, env).then(function (id) {
                    if (!id) callback(false);

                    user.update_sent(knex, id).then(function () {
                        sent_count++;
                        callback();
                    }, function (e) {
                        throw e;
                    });

                }).catch(function (e) {
                    throw e;
                });
            });

        }, function (e) {
            console.log('message_send finished');
            if (e) {
                running_type = message_send_status.running_type_configs.stopping;
                message_send_status.update_running_type(knex, running_type);
                reject(e);
            }
            running_type = message_send_status.running_type_configs.stopping;
            message_send_status.update_running_type(knex, running_type);
            resolve(true);
        });
    },host_res, knex, puppeteer, setting_row, env);
}