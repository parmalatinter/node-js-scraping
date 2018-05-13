exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('admin_users').del()
    .then(function () {
      // Inserts seed entries
      return knex('admin_users').insert([
          {
              "id" : 1,
              "email" : "ktoshi515226@yahoo.co.jp",
              "password" : "worksap",
              "name" : "としのり",
              "send_message" : "こんにちわ",
              "memo" : "最初のユーザー男性",
              "sex" : 1,
              "is_enable" : 1,
              'created_at' : knex.fn.now()
          },
          {
              "id" : 2,
              "email" : "k.toshi5152261030@gmail.com",
              "password" : "worksap",
              "name" : "makiko51",
              "send_message" : "こんにちわ",
              "memo" : "最初のユーザー女性",
              "sex" : 2,
              "is_enable" : 1,
              'created_at' : knex.fn.now()
          }
      ]);
    });
};
