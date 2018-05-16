const express = require('express');
const router = express.Router({});
const db = require('./../controllers/db/db');

router.get('/', function (req, host_res) {
    db.backup_list(req, host_res);
});

router.get('/backup', function (req, host_res) {
    db.backup(req, host_res, req.app.locals.env);
});

router.get('/to_csv', function (req, host_res) {
    db.to_csv(req.app.locals.knex, req, host_res);
});

router.get('/restore', function (req, host_res) {
    db.restore(req, host_res, req.app.locals.env);
});

router.get('/delete_backup', function (req, host_res) {
    db.delete_backup(req, host_res);
});

router.get('/delete_csv', function (req, host_res) {
    db.delete_csv(req, host_res);
});

router.get('/reset', function (req, host_res) {
    db.reset(req.app.locals.knex, req, host_res, req.app.locals.env);
});

router.get('/restart', function (req, host_res) {
    db.restart(req.app.locals.knex, req, host_res, req.app.locals.env);
});

module.exports = router;