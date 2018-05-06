exports.exec = function (host_res, knex, puppeteer) {
    const admin_user = require('./../../models/admin/user');
    const user = require('./../../models/user/user');
    const send_message = require('./../../libs/puppeteer/send_message');
    const async = require('async');
    admin_user.get_list(knex).then(function (user_records) {
        let sent_count = 0;
        async.each(user_records, function (user_record, callback) {
            let target_sex = user_record.sex === 1 ? 2 : 1;
            user.get_enable_send_list(knex, target_sex).then(function (send_list) {
                if (!send_list.length) {
                    callback();
                    return;
                }
                send_message.exec(puppeteer, user_record, send_list).then(function (sent_list) {
                    async.each(sent_list, function (sent_obj, callback2) {
                        user.update_sent(knex, sent_obj.id).then(function () {
                            sent_count++;
                            callback2();
                        }, function (e) {
                            throw e;
                        });
                    }, function (e) {
                        if (e) {
                            throw e;
                        }
                        callback();
                    });
                });
            });

        }, function (e) {
            if (e) {
                host_res.render('pages/error', {error: e});
            }
            host_res.render('pages/message_sent_result', {sent_count: sent_count});
        });
    }, function (e) {
        host_res.render('pages/error', {error: e});
    })


};