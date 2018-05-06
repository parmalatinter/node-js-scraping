const paginator = require('./../../libs/knex/knex-paginator');

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
        bbs_count : 0,//掲示板投稿数
        bad_reporting_count: 0,//被通報数
        is_enable_send: false, //メッセージ送信可能フラグ
        is_sent: false, //メッセージ送信フラグ
        created_at: 0, //登録日時
        registered_at: 0 //登録日時
    };
};

exports.get_list = function(knex, per_page) {
    return new Promise(function (resolve, reject) {
    const query = knex.select("*").from("users").orderBy('created_at', 'ASC');
    paginator(knex)(query, {perPage: per_page}).then(function (res, pagination) {
            console.log(res, pagination);
             if (res.data.length === 0) {
                resolve([]);
            } else {
                resolve(res.data);
            }
        }).catch(function (err) {
            reject(err);
        });
    });
};

exports.get_enable_send_list = function(knex, sex) {
    return new Promise(function(resolve, reject) {
        knex.select("id").where({is_enable_send : true, is_sent : false, sex : sex}).limit(1).from("users").then(function (rows) {
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
exports.get_non_exist_ids = function(knex, ids) {
    return new Promise(function(resolve, reject) {
        knex.select("id").from("users").whereIn("id", ids).then(function (rows) {
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
    return new Promise(function(resolve, reject) {
        knex("users").where("id", id)
                    .update({is_sent : true}).then(function () {
                        resolve(true);
                    })
                    .catch(function(err) {
                        reject(err);
                    });
    });
}
exports.update = function(knex, user_obj) {
    return new Promise(function(resolve, reject) {
        knex("users").where("id", user_obj.id).then(function (rows) {
            if (rows.length === 0) {
                user_obj.created_at = knex.fn.now();
                return knex("users").insert([user_obj])
                    .catch(function(err) {
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
                        bbs_count : user_obj.bbs_count,//掲示板投稿数
                        bad_reporting_count: user_obj.bad_reporting_count,//被通報数
                        update_at: knex.fn.now() //更新日時
                    }).catch(function(err) {
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