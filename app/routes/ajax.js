const express = require('express');
const router = express.Router({});

router.post('/get_status', function (req, host_res) {
    const status = require('./../controllers/ajax/status/status');
    status.get_running_info(req, req.app.locals.knex, host_res);
});

router.post('/user/get_info_all_count', function (req, host_res) {
    const user = require('./../controllers/ajax/user/user');
    user.get_info_all_count(req.app.locals.knex, host_res);
});

router.post('/user/get_send_all_count', function (req, host_res) {
    const user = require('./../controllers/ajax/user/user');
    user.get_send_all_count(req.app.locals.knex, host_res);
});

module.exports = router;