const paginator = require('../../libs/knex/knex-paginator');

exports.get_empty_user = function () {
    return {
        id: 0,
        name: "", //ニックネーム
        sex: 0, //性別
        age: 0, //年齢
        salary: "", //年収
        payment_status: "", //会員フラグ(プレミアム、ダイヤモンド)
        height: 0, //身長
        asset: "", //資産
        job: "", //職業
        body: "", //体型
        drinking: "", //飲酒
        smoking: "", //喫煙
        marriage: "", //婚姻状況
        location: "", //居住地
        about: "", //自己紹介
        dating_type: "", //交際タイプ
        message_count: 0, //メッセージ人数
        bbs_count: 0,//掲示板投稿数
        bad_reporting_count: 0,//被通報数
        is_enable_send: false, //メッセージ送信可能フラグ
        is_sent: false, //メッセージ送信フラグ
        is_image: false, //画像取得フラグ
        created_at: 0, //登録日時
        registered_at: 0 //登録日時
    };
};

exports.get_info_all_count_by_sex = function (knex, sex) {
    return new Promise(function (resolve, reject) {
        knex('users').debug(false).count('id as count').where({sex: sex}).then(function (rows) {
            if (rows.length === 0) {
                resolve(0);
            } else {
                resolve(rows[0].count);
            }
        }).catch(function (err) {
            reject(err);
        });
    });
};

exports.get_send_all_count_by_sex = function (knex, sex) {
    return new Promise(function (resolve, reject) {
        knex('users').debug(false).count('id as count').where({sex: sex, is_sent : true}).then(function (rows) {
            if (rows.length === 0) {
                resolve(0);
            } else {
                resolve(rows[0].count);
            }
        }).catch(function (err) {
            reject(err);
        });
    });
};

exports.get_list = function (knex, per_page, page, condition, sort) {
    return new Promise(function (resolve, reject) {
        let query = knex.debug(false).select("*")
            .from("users")
            .where(condition.standard)
            .orderBy(sort.name ? sort.name : 'created_at', sort.order ? sort.order : 'desc')
        for (name of Object.keys(condition.like)) {
            query = query.where(name, 'like', `%${ condition.like[name] }%`);
        }
        for (name of Object.keys(condition.between)) {
            query = query.whereBetween(name, [ condition.between[name][0], condition.between[name][1]]);
        }
        paginator(knex)(query, {perPage: per_page, page: page}).then(function (res) {
            resolve({data: res.data, pagination: res.pagination});
        }).catch(function (err) {
            reject(err);
        });
    });
};

exports.set_is_enable_send = function (knex, condition, is_enable_send) {
    return new Promise(function (resolve, reject) {
        if('is_enable_send' in condition.standard){
            delete condition.standard['is_enable_send'];
        }
        let query = knex("users");
        for (name of Object.keys(condition.like)) {
            query.where('like', `%${ condition.like[name] }%`);
        }
        query.where(condition.standard).update({is_enable_send: is_enable_send}).then(function () {
            resolve(true);
        })
        .catch(function (err) {
            reject(err);
        });
    });
};

exports.set_is_enable_send_by_ids = function (knex, ids, is_enable_send) {
    return new Promise(function (resolve, reject) {
        knex("users").whereIn('id', ids)
            .update({is_enable_send: is_enable_send}).then(function () {
                resolve(true);
            }).catch(function (err) {
                reject(err);
            });
    });
};

exports.get_enable_send_list = function (knex, sex) {
    return new Promise(function (resolve, reject) {
        knex.select("id").where({
            is_enable_send: true,
            is_sent: false,
            sex: sex
        }).limit(1).from("users").then(function (rows) {
            if (rows.length === 0) {
                resolve([]);
            } else {
                resolve(rows);
            }
        }).catch(function (err) {
            reject(err);
        });
    });
};
exports.get_non_exist_ids = function (knex, ids, sex) {
    return new Promise(function (resolve, reject) {
        knex.select("id").from("users").where({sex : sex}).whereIn("id", ids).then(function (rows) {
            if (rows.length === 0) {
                resolve(ids);
            } else {
                for (let row of rows) {
                    ids.forEach(function (id, index) {
                        if (id === Number(row.id)) {
                            ids.splice(index, 1);
                        }
                    });
                }
                resolve(ids);
            }
        }).catch(function (err) {
            reject(err);
        });
    });
};
exports.update_sent = function (knex, id) {
    return new Promise(function (resolve, reject) {
        knex("users").where("id", id)
            .update({is_sent: true}).then(function () {
            resolve(true);
        })
            .catch(function (err) {
                reject(err);
            });
    });
};
exports.update = function (knex, user_obj) {
    return new Promise(function (resolve, reject) {
        knex("users").where("id", user_obj.id).then(function (rows) {
            if (rows.length === 0) {
                user_obj.created_at = knex.fn.now();
                return knex("users").insert([user_obj])
                    .catch(function (err) {
                        throw(err)
                    });
            } else {
                knex("users").where("id", user_obj.id)
                    .update({
                        name: user_obj.name, //ニックネーム
                        sex: user_obj.sex, //性別
                        age: user_obj.age, //年齢
                        salary: user_obj.salary, //年収
                        payment_status: user_obj.payment_status, //会員フラグ(プレミアム、ダイヤモンド)
                        height: user_obj.height, //身長
                        asset: user_obj.asset, //資産
                        job: user_obj.job, //職業
                        body: user_obj.body, //体型
                        drinking: user_obj.drinking, //飲酒
                        smoking: user_obj.smoking, //喫煙
                        marriage: user_obj.marriage, //婚姻状況
                        location: user_obj.location, //居住地
                        about: user_obj.about, //自己紹介
                        dating_type: user_obj.dating_type,//交際タイプ
                        message_count: user_obj.message_count, //メッセージ人数
                        bbs_count: user_obj.bbs_count,//掲示板投稿数
                        bad_reporting_count: user_obj.bad_reporting_count,//被通報数
                        update_at: knex.fn.now() //更新日時
                    }).catch(function (err) {
                    throw(err);
                });
            }
        }).then(function () {
            resolve(true);
        }).catch(function (err) {
            reject(err);
        });
    })
};