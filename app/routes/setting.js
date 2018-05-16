const express = require('express');
const router = express.Router({});
const setting = require('./../controllers/admin/setting');

router.get('/', function (req, host_res) {
    setting.exec(req, host_res);
});

router.post('/update', function (req, host_res) {
    setting.update(req, host_res, req.app.locals.knex);
});

module.exports = router;