const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const env = process.env.NODE_ENV || 'development';
const db_config = require('./knexfile.js')[env];
const db_status = require("./app/models/db/status");
const render = require("./app/libs/express/render");
const bodyParser = require('body-parser');
const session = require('express-session');
const cloudinary = require('cloudinary');

cloudinary.config({ 
  cloud_name: 'hd3lnafya', 
  api_key: '686359141139713', 
  api_secret: 'v4Hl9N28aSMHf5p-W0KdPSgC3fQ' 
});

knex = require('knex')(db_config);

db_status.get(knex).then(function () {
    let app = express();
    app.locals.dirname = path.join(__dirname, '');
    app.locals.render = render.exec;
    app.locals.knex = knex;
    app.locals.cloudinary = cloudinary;
    app.locals.env = env;

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
        .use(express.static(path.join(__dirname, 'public')));
    const auth = require('./app/libs/express/auth');
    app.use(auth)
        .use('/admin/admin_user', require('./app/routes/admin_user'))
        .use('/admin/user', require('./app/routes/user'))
        .use('/admin/db', require('./app/routes/db'))
        .use('/admin/setting', require('./app/routes/setting'))
        .use('/scraping', require('./app/routes/scraping'))
        .use('/message', require('./app/routes/message'))
        .use('/ajax', require('./app/routes/ajax'))
        .set('views', path.join(__dirname, './app/views'))
        .set('view engine', 'ejs')
        .get('/', function (req, host_res) {
            req.app.locals.render(req, host_res, 'pages/index');
        });
    app.listen(PORT, () => console.log(`Listening on ${ PORT }  ${ env }. Open http://localhost:5000`));
}).catch(function (res) {
    const shell = require("./app/controllers/shell/init");
    if (res.err) {
        shell.db_init(db_config, env);
    }
});
