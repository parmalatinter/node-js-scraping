exports.up = function(knex, Promise) {
    return knex.schema.hasTable('users').then(function(exists) {
        if (!exists) {
            return knex.schema.createTable('users', function(t) {
                t.bigint('id').primary();
                t.integer('sex', 1); //性別
                t.integer('age', 3); //年齢
                t.integer('message_count', 10); //メッセージ人数
                t.integer('bbs_count', 10); //掲示板投稿
                t.integer('bad_reporting_count', 1); //被通報数
                t.string('payment_status', 1); //会員フラグ(プレミアム、ダイヤモンド)
                t.string('name', 100); //ニックネーム
                t.string('height', 10); //身長
                t.string('salary', 10); //年収
                t.string('asset', 20); //資産
                t.string('job', 10); //職業
                t.string('body', 10); //体型
                t.string('drinking', 10); //飲酒
                t.string('smoking', 10); //喫煙
                t.string('marriage', 10); //婚姻状況
                t.string('location', 10); //居住地
                t.string('dating_type'); //交際タイプ
                t.text('about'); //自己紹介
                t.boolean('is_enable_send'); //メッセージ送信可能フラグ
                t.boolean('is_sent');  //メッセージ送信済みフラグ
                t.timestamp('registered_at'); //登録日時
                t.timestamp('created_at'); //作成日時
                t.timestamp('update_at'); //更新日時
                t.index('sex');
                t.index('age');
                t.index('message_count');
                t.index('bbs_count');
                t.index('bad_reporting_count');
                t.index('name');
                t.index('height');
                t.index('salary');
                t.index('asset');
                t.index('job');
                t.index('body');
                t.index('drinking');
                t.index('smoking');
                t.index('marriage');
                t.index('location');
                t.index('dating_type');
                t.index('is_enable_send');
                t.index('is_sent');
                t.index('registered_at');
                t.index('created_at');
                t.index('update_at');
            }).catch(function (e) {
                console.log(e);
            });
        }else{
            return new Error("The table already exists");
        }
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.hasTable('users').then(function(exists) {
        if (exists) {
            return knex.schema.dropTable('users');
        }
    });
};
