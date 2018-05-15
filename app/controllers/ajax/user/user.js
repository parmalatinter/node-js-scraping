exports.get_info_all_count = function (knex, host_res) {
    const user = require('../../../models/user/user');
    let res = {
        men_count: 0,
        woman_count: 0
    };
    user.get_info_all_count_by_sex(knex, 1).then(function (men_count) {
        res.men_count = men_count;
        user.get_info_all_count_by_sex(knex, 2).then(function (woman_count) {
            res.woman_count = woman_count;
            host_res.send(JSON.stringify(res));
        })
    })
};

exports.get_send_all_count = function (knex, host_res) {
    const user = require('../../../models/user/user');
    let res = {
        men_count: 0,
        woman_count: 0
    };
    user.get_send_all_count_by_sex(knex, 1).then(function (men_count) {
        res.men_count = men_count;
        user.get_send_all_count_by_sex(knex, 2).then(function (woman_count) {
            res.woman_count = woman_count;
            host_res.send(JSON.stringify(res));
        })
    })
};