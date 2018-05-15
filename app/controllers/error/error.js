exports.exec = function (host_res, e, message) {
    host_res.render('pages/error', {
        message: message,
        error : e.message,
        stack :e.stack
    })
};