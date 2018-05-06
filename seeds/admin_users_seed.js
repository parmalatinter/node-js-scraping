exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('admin_users').del()
    .then(function () {
      // Inserts seed entries
      return knex('admin_users').insert([
          {
              "id" : "ktoshi515226@yahoo.co.jp",
              "password" : "worksap",
              "name" : "としのり",
              "memo" : "最初のユーザー男性",
              "sex" : 1,
              "is_enable" : 1,
              'created_at' : knex.fn.now()
          },
          {
              "id" : "k.toshi5152261030@gmail.com",
              "password" : "worksap",
              "name" : "makiko51",
              "memo" : "最初のユーザー女性",
              "sex" : 2,
              "is_enable" : 1,
              'created_at' : knex.fn.now()
          }
      ]);
    });
};
