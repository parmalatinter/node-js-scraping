
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('scraping_user_info_status').del()
    .then(function () {
      // Inserts seed entries
      return knex('scraping_user_info_status').insert([
        {id: 1, running_type: 0, created_at : knex.fn.now()}
      ]);
    });
};