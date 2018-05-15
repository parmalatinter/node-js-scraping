const async = require("async");
const message_send_status = require('../../models/status/message_send_status');
const user = require('../../models/user/user');
const session_message = require('../../libs/express/session_message');

exports.start = function (req, puppeteer, knex, my_user, send_obj, setting_row, env) {
    const send_message = require('../../libs/puppeteer/send_message');
    let running_type = message_send_status.running_type_configs.running;
    const sec = 1000;
    message_send_status.update_running_type(knex, running_type);
    return new Promise(function (resolve, reject) {
        async.whilst(
            function () {
                return running_type === message_send_status.running_type_configs.running
            },
            function (next) {
                message_send_status.get_running_type(knex).then(function (res) {
                    running_type = res;
                });
                send_message.exec(puppeteer, knex, my_user, send_obj, setting_row, env).then(function (res) {
                    if (!res) {
                        running_type = message_send_status.running_type_configs.stopping;
                        message_send_status.update_running_type(knex, running_type);
                    } else {
                        send_message.delay(setting_row.message_send_frequency_minute * 60 * sec).then(function () {
                            next();
                        });
                    }
                }).catch(function (e) {
                    throw e;
                });
            },
            function (e) {
                if (e) {
                    reject(e);
                }
                resolve(true);
                session_message.set_message(req, '送信完了');
            }
        );
    });
};


exports.exec = function (req, knex, puppeteer, env) {
    (async (req, host_res, knex, puppeteer, env) => {
        const setting = require("../../models/setting/setting");
        const setting_row = await setting.get(knex);
        const admin_user = require('../../models/admin/user');
        let running_type = message_send_status.running_type_configs.running;
        const user_records = await admin_user.get_enable_list(knex)

        async.each(user_records, function (user_record, callback) {
                let target_sex = user_record.sex === 1 ? 2 : 1;
                user.get_enable_send_list(knex, target_sex).then(function (send_list) {
                if (!send_list.length) {
                    callback(true);
                }
                exports.start(req, puppeteer, knex, user_record, send_list[0], setting_row, env).then(function () {
                    callback(true);
                }).catch(function (e) {
                    throw e;
                });
            }, function (e) {
                if(e){
                    session_message.set_error_message(req, e, 'メッセージ送信エラー');
                }else{
                    session_message.set_message(req, 'メッセージ送信エラー');
                }
                console.log('message_send finished');
                running_type = message_send_status.running_type_configs.stopping;
                message_send_status.update_running_type(knex, running_type);
            });
        })
    })(req, knex, puppeteer, env);
};