
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
          {
              "id" : 20581191786043,
              "name" : "としのり",
              "sex" : 1,
              "is_enable_send" : true,
              "is_sent" : false
          },
          {
              "id" : 20581191772051,
              "name" : "makiko51",
              "sex" : 2,
              "is_enable_send" : true,
              "is_sent" : false
          },
      ]);
    });
};
