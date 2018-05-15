const validator = require('validator');
exports.admin_user = function (condition, is_update) {
    let res = {};
    if(!condition){
        return false;
    }
    if (is_update && !condition.id) return false;
    if (('name' in condition)){
        if (!validator.isLength(condition.name, {min:1, max: undefined})) return false;
        res.name = condition.name;
    }
    if (('email' in condition)){
        if (!validator.isLength(condition.name, {min:1, max: undefined})) return false;
        res.email = condition.email;
    }
    if (('password' in condition)){
        if (!validator.isLength(condition.password, {min:1, max: 20})) return false;
        res.password = condition.password;
    }
    if (('send_message' in condition)){
        if (!validator.isLength(condition.send_message, {min:1, max: undefined})) return false;
        res.send_message = condition.send_message;
    }
    if (('memo' in condition)){
        if (!validator.isLength(condition.memo, {min:1, max: undefined})) return false;
        res.memo = condition.memo;
    }
    if (('sex' in condition)){
        if (!validator.isInt(condition.sex, {min:1, max: 2})) return false;
        res.sex = condition.sex;
    }
    if (('is_enable' in condition)){
        if (validator.isBoolean(condition.is_enable)){
            res.is_enable = condition.is_enable;
        }else{
            res.is_enable = false;
        }
    }else{
        res.is_enable = false;
    }
    return res;
};