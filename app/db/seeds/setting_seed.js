exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('setting').del()
        .then(function () {
            // Inserts seed entries
            return knex('setting').insert([
                {
                    id: 1,
                    message_send_frequency_minute: 5,
                    is_debug_mode: true,
                    is_headless_mode: true,
                    is_need_image: true,
                    created_at: knex.fn.now()
                }
            ]);
        });
};
