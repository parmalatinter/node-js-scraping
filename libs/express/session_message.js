exports.set_message = function (req, message) {
    req.session.message = message;
};

exports.set_error_message = function (req, error, message) {
    req.session.error_message = message;
    req.session.error = error;
};