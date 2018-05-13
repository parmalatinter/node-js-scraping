exports.up = function (knex, Promise) {
    return knex.schema.hasTable("setting").then(function (exists) {
        if (!exists) {
            knex.schema.createTable("setting", function (t) {
                t.increments("id").primary();
                t.boolean('is_headless_mode').defaultTo(false);
                t.boolean('is_debug_mode').defaultTo(true);
                t.boolean('is_need_image').defaultTo(true);
                t.integer('message_send_frequency_minute', 2).defaultTo(5);
                t.timestamp('created_at').defaultTo(knex.fn.now());
            }).catch(function (e) {
                console.log(e);
            });
        } else {
            return new Error("The table already exists");
        }
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.hasTable("setting").then(function (exists) {
        if (exists) {
            return knex.schema.dropTable("setting");
        }
    });
};
