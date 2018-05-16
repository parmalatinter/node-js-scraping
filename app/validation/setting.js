const validator = require('validator');
exports.setting = function (condition) {
    let res = {};
    if (!condition) {
        return false;
    }
    if (('is_headless_mode' in condition)) {
        if (validator.isBoolean(condition.is_headless_mode)) {
            res.is_headless_mode = condition.is_headless_mode;
        } else {
            res.is_headless_mode = false;
        }
    } else {
        res.is_headless_mode = false;
    }
    if (('is_need_image' in condition)) {
        if (validator.isBoolean(condition.is_need_image)) {
            res.is_need_image = condition.is_need_image;
        } else {
            res.is_need_image = false;
        }
    } else {
        res.is_need_image = false;
    }
    if (('is_debug_mode' in condition)) {
        if (validator.isBoolean(condition.is_debug_mode)) {
            res.is_debug_mode = condition.is_debug_mode;
        } else {
            res.is_debug_mode = false;
        }
    } else {
        res.is_debug_mode = false;
    }
    if (('message_send_frequency_minute' in condition)) {
        if (!validator.isInt(condition.message_send_frequency_minute, {min: 0, max: 60})) return false;
        res.message_send_frequency_minute = condition.message_send_frequency_minute;
    }
    return res;
};