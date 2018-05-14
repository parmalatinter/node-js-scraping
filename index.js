const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

const puppeteer = require('puppeteer');

const env = process.env.NODE_ENV || 'development';
const config = require('./knexfile.js')[env];
const setting = require("./models/setting/setting");
const db_status = require("./models/db/status");
const render = require("./libs/express/render");
const bodyParser = require('body-parser');
const session = require('express-session'); // 追加

knex = require('knex')(config);

db_status.get(knex).then(function (res) {

    console.log(res);
    let app = express();
    app.use(bodyParser.urlencoded());

    app.use(bodyParser.json());
    app.use(session({
        secret: 'scraping-awesome',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 30 * 60 * 1000
        }
    }));

    app.locals.dirname = path.join(__dirname, '');
    app.locals.render = render.exec;
    app.locals.knex = knex;

    app
        .use(express.static(path.join(__dirname, 'public')))
        .set('views', path.join(__dirname, 'views'))
        .set('view engine', 'ejs')
        .get('/', function (req, host_res) {
            req.app.locals.render(req, host_res, 'pages/index', {contents: [], home_url: '', name: 'test'});
        })
        .post('/admin/user', function (req, host_res) {
            let users = require('./controllers/admin/users');
            users.exec(req, host_res, knex);
        })
        .get('/admin/user', function (req, host_res) {
            let users = require('./controllers/admin/users');
            users.exec(req, host_res, knex);
        })
        .post('/admin/user/set_is_enable_send', function (req, host_res) {
            let users = require('./controllers/admin/users');
            users.set_is_enable_send(req, host_res, knex, true);
        })
        .post('/admin/user/unset_is_enable_send', function (req, host_res) {
            let users = require('./controllers/admin/users');
            users.set_is_enable_send(req, host_res, knex, false);
        })
        .post('/admin/user/set_is_enable_send_by_ids', function (req, host_res) {
            let users = require('./controllers/admin/users');
            users.set_is_enable_send_by_ids(req, host_res, knex);
        })
        .get('/admin/admin_user', function (req, host_res) {
            let users = require('./controllers/admin/admin_users');
            users.exec(req, host_res, knex, null);
        })
        .post('/admin/admin_user/insert', function (req, host_res) {
            let users = require('./controllers/admin/admin_users');
            users.insert(req, host_res, knex, null);
        })
        .post('/admin/admin_user/delete', function (req, host_res) {
            let users = require('./controllers/admin/admin_users');
            users.delete(req, host_res, knex, null);
        })
        .post('/admin/admin_user/update', function (req, host_res) {
            let users = require('./controllers/admin/admin_users');
            users.update(req, host_res, knex, null);
        })
        .get('/admin/setting', function (req, host_res) {
            let setting = require('./controllers/admin/setting');
            setting.exec(req, host_res, knex, null);
        })
        .post('/admin/setting/update', function (req, host_res) {
            let setting = require('./controllers/admin/setting');
            setting.update(req, host_res, knex);
        })
        .get('/admin/db', function (req, host_res) {
            let backup_list = require('./controllers/db/backup_list');
            backup_list.exec(req, host_res);
        })
        .get('/admin/db/backup', function (req, host_res) {
            let backup = require('./controllers/db/backup');
            backup.exec(req, host_res);
        })
        .get('/admin/db/restore', function (req, host_res) {
            let restore = require('./controllers/db/restore');
            restore.exec(req, host_res);
        })
        .get('/admin/db/delete_backup', function (req, host_res) {
            let delete_backup = require('./controllers/db/delete');
            delete_backup.exec(req, host_res);
        })
        .get('/admin/db/reset', function (req, host_res) {
            let reset = require('./controllers/db/reset');
            reset.exec(knex, req, host_res, env);
        })
        .post('/ajax/get_status', function (req, host_res) {
            let status = require('./controllers/ajax/status/status');
            status.get_running_type(knex, host_res);
        })
        .post('/ajax/user/get_info_all_count', function (req, host_res) {
            let user = require('./controllers/ajax/user/user');
            user.get_info_all_count(knex, host_res);
        })
        .post('/ajax/user/get_send_all_count', function (req, host_res) {
            let user = require('./controllers/ajax/user/user');
            user.get_send_all_count(knex, host_res);
        })
        .get('/scraping/start', function (req, host_res) {
            let users_info = require('./controllers/scraping/users_info');
            setting.get(knex).then(function (setting_row) {
                users_info.exec(host_res, knex, puppeteer, setting_row, env);
            })
        })
        .get('/scraping/stop', function (req, host_res) {
            let status = require('./controllers/ajax/status/status');
            status.stop_info_running(knex, host_res);
        })
        .get('/message/send', function (req, host_res) {
            let send_message = require('./controllers/scraping/send_message');
            send_message.start(host_res, knex, puppeteer, setting_row, env).catch(err => {
                console.log(err);
            });
        })
        .get('/message/stop', function (req, host_res) {
            let status = require('./controllers/ajax/status/status');
            status.stop_send_running(knex, host_res);
        })
        .get('/message/send_by_frequency', function (req, host_res) {
            let send_message = require('./controllers/scraping/send_message');
            setting.get_frequency_minute(knex).then(function (minute) {
                setInterval(function () {
                    setting.is_headless_mode(knex).then(function (is_headless_mode) {
                        send_message.exec(host_res, knex, puppeteer, is_headless_mode);
                    });
                }, minute * 60)
            })
        }).listen(PORT, () => console.log(`Listening on ${ PORT }`));
}).catch(function (res) {
    if (res.err) {
        const shell = require("./controllers/shell/init");
        shell.db_init(config, env).then(function () {
            console.log(`データベースを初期化しました。 npm start --env ${env} を実施してください`);
        }).catch(function (e) {
            shell.db_restart();
            console.log(`データベース起動しました。 npm start --env ${env} を実施してください`);
        });
    }
});
