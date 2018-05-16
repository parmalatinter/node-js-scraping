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
                }).catch(function (e) {
                    throw e;
                });
                send_message.exec(puppeteer, knex, my_user, send_obj, setting_row, env).then(function (id) {
                    let target_sex = my_user.sex === 1 ? 2 : 1;
                    if (id) {
                        user.update_sent(knex, id).then(function () {

                            let time = setting_row.message_send_frequency_minute * 60 * sec;
                            console.log('waiting delay...........' + time + 'milli sec');
                            send_message.delay(time + 1).then(function () {
                                console.log('waiting finish');
                                user.get_enable_send_list(knex, target_sex).then(function (send_list) {
                                    if (send_list.length) {
                                        console.log('start next');
                                        send_obj = send_list[0];
                                        next();
                                    }else{
                                        return true;
                                    }
                                }).catch(function (e) {
                                    throw e;
                                });
                            });
                        }).catch(function (e) {
                            throw e;
                        });
                    }else{
                        user.get_enable_send_list(knex, target_sex).then(function (send_list) {
                            if (send_list.length) {
                                send_obj = send_list[0];
                                next();
                            }else{
                                return true;
                            }
                        }).catch(function (e) {
                            throw e;
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
            }
        );
    });
};


exports.exec = function (req, knex, puppeteer, env) {
    let is_men_sent = false;
    let is_women_sent = false;
    (async (req, knex, puppeteer, env) => {
        const setting = require("../../models/setting/setting");
        const setting_row = await setting.get(knex);
        const admin_user = require('../../models/admin/user');
        let running_type = message_send_status.running_type_configs.running;
        const user_records = await admin_user.get_enable_list(knex).catch(function (e) {
            session_message.set_error_message(req, e , '管理者取得エラー');
        });

        async.each(user_records, function (user_record, callback) {
            let target_sex = user_record.sex === 1 ? 2 : 1;
            user.get_enable_send_list(knex, target_sex).then(function (send_list) {
                if (!send_list.length) {
                    is_men_sent = target_sex === 1;
                    is_women_sent = target_sex === 2;
                    callback(true);
                }else{
                    exports.start(req, puppeteer, knex, user_record, send_list[0], setting_row, env).catch(function (e) {
                        throw e;
                    });
                }
            })
        }, function (e) {
                if(e instanceof Object){
                    session_message.set_error_message(req, e, 'メッセージ送信エラー');
                }else{
                    session_message.set_message(req, 'メッセージ送信完了');
                }
                if(is_women_sent && is_men_sent){
                    console.log('message_send finished');
                    running_type = message_send_status.running_type_configs.stopping;
                    message_send_status.update_running_type(knex, running_type);
                }

        });
    })(req, knex, puppeteer, env);
};