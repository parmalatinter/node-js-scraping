const validator = require('validator');
const search_condition = require('../config/search_condition.json');

exports.search = function (condition) {
        let result = {standard : {}, like: {}, between :{}, number : {}};
        if(!condition){
            return result;
        }
        for (let name of Object.keys(search_condition.numbers)) {
            if (!condition[name]) continue;
            if (!validator.isAlphanumeric(condition[name])) return false;
            if (condition[name] !== '0') result.number[name] = Number(condition[name]);
        }
        for (let name of Object.keys(search_condition.selects)) {
            if (!condition[name]) continue;
            if (!validator.isAlphanumeric(condition[name])) return false;
            if (condition[name] !== '0') {
                result.standard[name] = Number(condition[name]);
            }
        }
        for (let name of Object.keys(search_condition.checks)) {
            if (!condition[name]){
                result.standard[name] = false;
                continue;
            }
            if (validator.isBoolean(condition[name])){
                result.standard[name] = condition[name];
            }else{
                result.standard[name] = false;
            }
        }
        for (let name of Object.keys(search_condition.between)) {
            if (!Array.isArray(condition[name]) || !condition[name]){
                condition[name] = [search_condition.between[name].min[0], search_condition.between[name].max[0]]
                continue;
            }
            if(condition[name].length < 1){
                condition[name] = [search_condition.between[name].min[0], search_condition.between[name].max[0]]
                continue;
            }
            let res = [];
            condition[name].forEach(function (value , key) {

                 if (validator.isInt(value)){
                    res.push( value);
                }else{
                     if(!key){
                         res.push(search_condition.between[name].min[0]);
                     }else {
                         res.push(search_condition.between[name].max[0]);
                     }

                }
            });
            result.between[name] = res;
        }
        for (let name of Object.keys(search_condition.texts)) {
            if (!condition[name]) continue;
            if (!validator.isLength(condition[name], {min:0, max: undefined})) return false;
            result.like[name] = condition[name];
        }
        for (let name of Object.keys(search_condition.timestamps)) {
            if (!condition[name]) continue;
            if (!validator.isISO8601(condition[name])) return false;
            result.between[name] = condition.between[name];
        }
        return result;
};

exports.convert_selects_condition = function (condition) {
    for (let name of Object.keys(search_condition.selects)) {
        if (condition.standard[name]) {
            let index = Number(condition.standard[name]);
            if(name !== 'sex'){
                condition.standard[name] = search_condition.selects[name][index];
            }else{
                condition.standard[name] = index;
            }

        }
    }
    return condition.standard;
};

exports.sort = function (condition) {
    let res = {order :'desc', name : 'id'};
    if(!condition || !condition.sort){
        return res;
    }
    if(condition.sort[0]){
        res.name = condition.sort[0];
    }
    if(condition.order && condition.order[0]){
        res.order = condition.order[0];
    }
    return res;
};