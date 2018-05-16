exports.set_message = function (req, message) {
    req.session.message = message;
    req.session.save();
};

exports.set_error_message = function (req, error, message) {
    req.session.error_message = message;
    req.session.error = error;
};

exports.get_messages = function (req) {
    let res = {
        message: req.session.message,
        error: req.session.error,
        error_message: req.session.error_message
    };
    req.session.message = '';
    req.session.error_message = '';
    req.session.error = '';
    return res;
};