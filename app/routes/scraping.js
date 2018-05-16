const express = require('express');
const router = express.Router({});
const puppeteer = require('puppeteer');
const users_info = require('./../controllers/scraping/users_info');

router.post('/start', function (req) {
    const users_info = require('./../controllers/scraping/users_info');
    users_info.exec(req, req.app.locals.knex, puppeteer, req.app.locals.env);
});

router.post('/stop', function (req, host_res) {
    const status = require('./../controllers/ajax/status/status');
    status.stop_info_running(req.app.locals.knex, host_res);
});

module.exports = router;