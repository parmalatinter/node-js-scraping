const validator = require('validator');
exports.setting = function (condition) {
    let res = {};
    if (!condition) {
        return false;
    }

    for( let key of ['is_headless_mode', 'is_need_image', 'is_debug_mode'] ){
        if ( key in condition) {
            if (validator.isBoolean(condition[key])) {
                res[key] = condition[key];
            } else {
                res[key] = false;
            }
        } else {
            res[key] = false;
        }
    }

    if (('message_send_frequency_minute' in condition)) {
        if (!validator.isInt(condition.message_send_frequency_minute, {min: 0, max: 60})) return false;
        res.message_send_frequency_minute = condition.message_send_frequency_minute;
    }
    return res;
};