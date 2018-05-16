const express = require('express');
const router = express.Router({});
const users = require('./../controllers/admin/users');

router.post('/', function (req, host_res) {
    users.exec(req, host_res, req.app.locals.knex);
});

router.get('/', function (req, host_res) {
    users.exec(req, host_res, req.app.locals.knex);
});

router.get('/reset_search_condition', function (req, host_res) {
    req.session.serch_condition = false;
    users.exec(req, host_res, req.app.locals.knex);
});

router.post('/set_is_enable_send', function (req, host_res) {
    users.set_is_enable_send(req, host_res, req.app.locals.knex, true);
});

router.post('/unset_is_enable_send', function (req, host_res) {
    users.set_is_enable_send(req, host_res, req.app.locals.knex, false);
});

router.post('/set_is_enable_send_by_ids', function (req, host_res) {
    users.set_is_enable_send_by_ids(req, host_res, req.app.locals.knex);
});

module.exports = router;