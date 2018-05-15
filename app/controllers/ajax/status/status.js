exports.get_running_type = function (knex, host_res) {
    const message_send_status = require('../../../models/status/message_send_status');
    const scraping_user_info_status = require('../../../models/status/scraping_user_info_status');
    let res = {
        message_send_status : {running_type : 0},
        scraping_user_info_status : {running_type : 0}
    };
    message_send_status.get_running_type(knex).then(function (message_send_status) {
        res.message_send_status = message_send_status;
        scraping_user_info_status.get_running_type(knex).then(function (scraping_user_info_status) {
            res.scraping_user_info_status = scraping_user_info_status;
            let json = JSON.stringify(res);
            host_res.send(json);
       })
    });
};

exports.stop_info_running = function (knex, host_res) {
    const scraping_user_info_status = require('../../../models/status/scraping_user_info_status');
    let res = {
        message_send_status : {running_type : 0}
    };
    scraping_user_info_status.update_running_type(knex, scraping_user_info_status.running_type_configs.stopping).then(function (message_send_status) {
        res.message_send_status = message_send_status;
        let json = JSON.stringify(res);
        host_res.send(json);
    });
};

exports.stop_send_running = function (knex, host_res) {
    const message_send_status = require('../../../models/status/message_send_status');
    let res = {
        message_send_status : {running_type : 0}
    };
    message_send_status.update_running_type(knex, message_send_status.running_type_configs.stopping).then(function (message_send_status) {
        res.message_send_status = message_send_status;
        let json = JSON.stringify(res);
        host_res.send(json);
    });
};