const auth = require('basic-auth');

module.exports = function (req, host_res, next) {
    var user = auth(req);
    if (!user){
        host_res.set('WWW-Authenticate', 'Basic realm="scraping"');
        return host_res.status(401).send();
    }
    req.app.locals.knex.select('*').where({'email': user.name,'password' : user.pass}).from('admin_users').then(function (rows) {
        if (rows.length === 0) {
            host_res.set('WWW-Authenticate', 'Basic realm="scraping"');
            return host_res.status(401).send();
        } else {
            return next();
        }
    }).catch(function (err) {
        console.log(err);
        return host_res.status(401).send();
    });
};