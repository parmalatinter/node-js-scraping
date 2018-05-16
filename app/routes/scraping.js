const express = require('express');
const router = express.Router({});
const puppeteer = require('puppeteer');
const users_info = require('./../controllers/scraping/users_info');

router.post('/start', function (req) {
    users_info.exec(req, req.app.locals.knex, puppeteer, env);
});

router.post('/stop', function (req, host_res) {
    status.stop_info_running(req.app.locals.knex, host_res);
});

module.exports = router;