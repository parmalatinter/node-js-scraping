
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('message_send_status').del()
    .then(function () {
      // Inserts seed entries
      return knex('message_send_status').insert([
        {id: 1, running_type: 0, created_at : knex.fn.now()}
      ]);
    });
};
