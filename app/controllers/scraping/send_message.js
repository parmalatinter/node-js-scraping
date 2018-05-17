const async = require("async");
const message_send_status = require('../../models/status/message_send_status');
const user = require('../../models/user/user');
const session_message = require('../../libs/express/session_message');
let finish_count = 0;
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
                    send_message.exec(puppeteer, knex, my_user, send_obj, setting_row, env)
                        .then(function (id) {
                            let target_sex = my_user.sex === 1 ? 2 : 1;
                            if (id) {
                                user.update_sent(knex, id).then(function () {
                                    let time = setting_row.message_send_frequency_minute * 60 * sec;
                                    console.log('waiting delay...........' + time + 'milli sec');
                                    console.log('waiting finish');
                                    user.get_enable_send_list(knex, target_sex).then(function (send_list) {
                                        if (send_list.length) {
                                            send_message.delay(time + 1).then(function () {
                                                console.log('start next');
                                                send_obj = send_list[0];
                                                next();
                                            });
                                        } else {
                                            if (target_sex === 1) {
                                                session_message.set_message(req, '女性メッセージ送信完了');
                                                finish_count++;
                                            }
                                            if (target_sex === 2) {
                                                session_message.set_message(req, '男性メッセージ送信完了');
                                                finish_count++;
                                            }
                                            if(finish_count > 1){
                                                session_message.set_message(req, '全メッセージ送信完了');
                                            }
                                            resolve(true)
                                        }
                                    }).catch(function (e) {
                                        throw e;
                                    });
                                }).catch(function (e) {
                                    throw e;
                                });
                            } else {
                                next();
                            }
                        })
                        .catch(function (e) {
                            throw e;
                        });
                }).catch(function (e) {
                    reject(e);
                });
            },
            function (result) {
                return result;
            },
        );
    });
};


exports.exec = function (req, knex, puppeteer, env) {
    (async (req, knex, puppeteer, env) => {
        const setting = require("../../models/setting/setting");
        const setting_row = await setting.get(knex);
        const admin_user = require('../../models/admin/user');
        const user_records = await admin_user.get_enable_list(knex).catch(function (e) {
            session_message.set_error_message(req, e, '管理者取得エラー');
        });
        async.each(user_records, function (user_record, callback) {
            let target_sex = user_record.sex === 1 ? 2 : 1;
            user.get_enable_send_list(knex, target_sex).then(function (send_list) {
                if (!send_list.length) {
                    callback(true);
                } else {
                    exports.start(req, puppeteer, knex, user_record, send_list[0], setting_row, env).then(function (result) {
                        callback(true);
                    }).catch(function (e) {
                        return e;
                    });
                }
            }).catch(function (e) {
                return e;
            });
        }, function (e) {
            if (e instanceof Object) {
                session_message.set_error_message(req, e, 'メッセージ送信エラー');
            }
        });
    })(req, knex, puppeteer, env);
};