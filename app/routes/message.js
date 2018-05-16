const express = require('express');
const router = express.Router({});
const puppeteer = require('puppeteer');
const send_message = require('./../controllers/scraping/send_message');

router.post('/send', function (req) {
    send_message.exec(req, knex, puppeteer, env);
});

router.post('/stop', function (req, host_res) {
    status.stop_send_running(knex, host_res);
});

module.exports = router;