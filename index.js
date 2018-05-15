const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const env = process.env.NODE_ENV || 'development';
const puppeteer = require('puppeteer');
const db_config = require('./app/db/config.js')[env];
const db_status = require("./app/models/db/status");
const render = require("./app/libs/express/render");
const bodyParser = require('body-parser');
const session = require('express-session');

knex = require('knex')(db_config);

db_status.get(knex).then(function () {
    let app = express();
    app.locals.dirname = path.join(__dirname, '');
    app.locals.render = render.exec;
    app.locals.knex = knex;

    app
        .use(bodyParser.urlencoded({ extended: true }))
        .use(bodyParser.json())
        .use(express.static('public'))
        .use(session({
            secret: 'scraping-awesome',
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 30 * 60 * 1000
            }
        }))
        .use(express.static(path.join(__dirname, 'public')))
        .set('views', path.join(__dirname, './app/views'))
        .set('view engine', 'ejs')
        .get('/', function (req, host_res) {
            req.app.locals.render(req, host_res, 'pages/index', {contents: [], home_url: '', name: 'test'});
        })
        .post('/admin/user', function (req, host_res) {
            const users = require('./app/controllers/admin/users');
            users.exec(req, host_res, knex);
        })
        .get('/admin/user', function (req, host_res) {
            const users = require('./app/controllers/admin/users');
            users.exec(req, host_res, knex);
        })
        .post('/admin/user/set_is_enable_send', function (req, host_res) {
            const users = require('./app/controllers/admin/users');
            users.set_is_enable_send(req, host_res, knex, true);
        })
        .post('/admin/user/unset_is_enable_send', function (req, host_res) {
            const users = require('./app/controllers/admin/users');
            users.set_is_enable_send(req, host_res, knex, false);
        })
        .post('/admin/user/set_is_enable_send_by_ids', function (req, host_res) {
            const users = require('./app/controllers/admin/users');
            users.set_is_enable_send_by_ids(req, host_res, knex);
        })
        .get('/admin/admin_user', function (req, host_res) {
            const users = require('./app/controllers/admin/admin_users');
            users.exec(req, host_res, knex, null);
        })
        .post('/admin/admin_user/insert', function (req, host_res) {
            const users = require('./app/controllers/admin/admin_users');
            users.insert(req, host_res, knex, null);
        })
        .post('/admin/admin_user/delete', function (req, host_res) {
            const users = require('./app/controllers/admin/admin_users');
            users.delete(req, host_res, knex, null);
        })
        .post('/admin/admin_user/update', function (req, host_res) {
            const users = require('./app/controllers/admin/admin_users');
            users.update(req, host_res, knex, null);
        })
        .get('/admin/setting', function (req, host_res) {
            const setting = require('./app/controllers/admin/setting');
            setting.exec(req, host_res);
        })
        .post('/admin/setting/update', function (req, host_res) {
            const setting = require('./app/controllers/admin/setting');
            setting.update(req, host_res, knex);
        })
        .get('/admin/db', function (req, host_res) {
            const db = require('./app/controllers/db/db');
            db.backup_list(req, host_res);
        })
        .get('/admin/db/backup', function (req, host_res) {
            const db = require('./app/controllers/db/db');
            db.backup(req, host_res);
        })
        .get('/admin/db/csv', function (req, host_res) {
            const db = require('./app/controllers/db/db');
            db.csv(knex, req, host_res);
        })
        .get('/admin/db/restore', function (req, host_res) {
            const db = require('./app/controllers/db/db');
            db.restore(req, host_res);
        })
        .get('/admin/db/delete_backup', function (req, host_res) {
            const db = require('./app/controllers/db/db');
            db.delete_backup(req, host_res);
        })
        .get('/admin/db/delete_csv', function (req, host_res) {
            const db = require('./app/controllers/db/db');
            db.delete_csv(req, host_res);
        })
        .get('/admin/db/reset', function (req, host_res) {
            const db = require('./app/controllers/db/db');
            db.reset(knex, req, host_res, env);
        })
        .post('/ajax/get_status', function (req, host_res) {
            const status = require('./app/controllers/ajax/status/status');
            status.get_running_info(req, knex, host_res);
        })
        .post('/ajax/user/get_info_all_count', function (req, host_res) {
            const user = require('./app/controllers/ajax/user/user');
            user.get_info_all_count(knex, host_res);
        })
        .post('/ajax/user/get_send_all_count', function (req, host_res) {
            const user = require('./app/controllers/ajax/user/user');
            user.get_send_all_count(knex, host_res);
        })
        .post('/scraping/start', function (req, host_res) {
            const users_info = require('./app/controllers/scraping/users_info');
            users_info.exec(req, knex, puppeteer, env);
        })
        .post('/scraping/stop', function (req, host_res) {
            const status = require('./app/controllers/ajax/status/status');
            status.stop_info_running(knex, host_res);
        })
        .post('/message/send', function (req, host_res) {
            const send_message = require('./app/controllers/scraping/send_message');
            send_message.exec(req, knex, puppeteer, env);
        })
        .post('/message/stop', function (req, host_res) {
            const status = require('./app/controllers/ajax/status/status');
            status.stop_send_running(knex, host_res);
        })
        .listen(PORT, () => console.log(`Listening on ${ PORT }`));
}).catch(function (res) {
    if (res.err) {
        const shell = require("./app/controllers/shell/init");
        shell.db_init(config, env);
    }
});
