var async = require("async");
exports.exec = function (host_res, knex, puppeteer) {
    const admin_user = require("./../../models/admin/user");
    const user_info = require("./../../libs/puppeteer/user_info");
    const user = require("./../../models/user/user");
    admin_user.get_list(knex).then(function (user_records) {
        let sent_count = 0;
        async.each(user_records, function (user_record, callback) {
            user_info.exec(puppeteer, knex, user_record).then(function (user_infos) {
                async.each(user_infos, function (user_info, callback2) {
                    user.update(knex, user_info).then(function () {
                        callback2();
                    }).catch(function (e) {
                        throw e;
                    });
                }, function (e) {
                    if (e) {
                        throw e;
                    }
                    sent_count += user_infos.length;
                    callback();
                });
            }).catch(function (e) {
                if (e) {
                    throw e;
                }
            });
        }, function (e) {
            if (e) {
                host_res.render("pages/error", {error: e});
            }
            host_res.render("pages/message_sent_result", {sent_count: sent_count});
        });
    }, function (e) {
        host_res.render("pages/error", {error: e});
    });
};