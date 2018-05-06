const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

const puppeteer = require('puppeteer');

var env = process.env.NODE_ENV || 'development';
var config = require('./knexfile.js')[env];

knex = require('knex')(config);

var app = express();

app
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', function (req, host_res) {
        host_res.render('pages/index', {contents : [], home_url : '', name :'test'})
    })
    .get('/admin/user', function (req, host_res) {
        var users = require('./controllers/admin/users');
        users.exec(req, host_res, knex);
    })
    .get('/admin/admin_user/setting', function (req, host_res) {
        host_res.render('pages/admin', {contents : [], home_url : '', name :'test'})
    })
    .get('/admin/admin_user/new', function (req, host_res) {
        host_res.render('pages/admin', {contents : [], home_url : '', name :'test'})
    })
    .get('/admin/admin_user/delete', function (req, host_res) {
        host_res.render('pages/admin/user', {contents : [], home_url : '', name :'test'})
    })
    .get('/admin/admin_user/update', function (req, host_res) {
        host_res.render('pages/admin', {contents : [], home_url : '', name :'test'})
    })
    .get('/scraping', function (req, host_res) {
        var users_info = require('./controllers/scraping/users_info');
        users_info.exec(host_res, knex, puppeteer);
    })
    .get('/message/send', function (req, host_res) {
        var send_message = require('./controllers/scraping/send_message');
        send_message.exec(host_res, knex, puppeteer);
    }).listen(PORT, () => console.log(`Listening on ${ PORT }`))