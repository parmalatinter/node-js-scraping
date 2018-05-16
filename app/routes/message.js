const express = require('express');
const router = express.Router({});
const puppeteer = require('puppeteer');


router.post('/send', function (req) {
    const send_message = require('./../controllers/scraping/send_message');
    send_message.exec(req, knex, puppeteer, req.app.locals.env);
});

router.post('/stop', function (req, host_res) {
    const status = require('./../controllers/ajax/status/status');
    status.stop_send_running(knex, host_res);
});

module.exports = router;