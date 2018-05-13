exports.exec = function (host_res, knex, puppeteer, setting_row, env) {
    return new Promise(function (resolve, reject) {
        const admin_user = require('./../../models/admin/user');
        const user = require('./../../models/user/user');
        const send_message = require('./../../libs/puppeteer/send_message');
        const async = require('async');
        const message_send_status = require('./../../models/status/message_send_status');
        let running_type = message_send_status.running_type_configs.running;
        admin_user.get_enable_list(knex).then(function (user_records) {
            let sent_count = 0;
            async.each(user_records, function (user_record, callback) {
                let target_sex = user_record.sex === 1 ? 2 : 1;
                user.get_enable_send_list(knex, target_sex).then(function (send_list) {
                    if (!send_list.length) {
                        callback(true);
                        return;
                    }
                    send_message.exec(puppeteer, knex, user_record, send_list[0], setting_row, env).then(function (id) {
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
                resolve(true);
            });
        }).catch(function (e) {
            running_type = message_send_status.running_type_configs.stopping;
            message_send_status.update_running_type(knex, running_type);
            host_res.render('pages/error', {error: e});
        })
    });
};