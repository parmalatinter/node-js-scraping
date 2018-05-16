const express = require('express');
const router = express.Router({});
const users = require('./../controllers/admin/admin_users');

router.get('/', function (req, host_res) {
    users.exec(req, host_res, req.app.locals.knex, null);
});

router.post('/insert', function (req, host_res) {
    users.insert(req, host_res, req.app.locals.knex, null);
});

router.post('/delete', function (req, host_res) {
    users.delete(req, host_res, req.app.locals.knex, null);
});

router.post('/update', function (req, host_res) {
    users.update(req, host_res, req.app.locals.knex, null);
});

module.exports = router;