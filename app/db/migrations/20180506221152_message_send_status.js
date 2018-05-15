exports.up = function (knex, Promise) {
    return knex.schema.hasTable("message_send_status").then(function (exists) {
        if (!exists) {
            knex.schema.createTable("message_send_status", function (t) {
                t.integer("id").primary();
                t.integer('running_type', 1).defaultTo(0);
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
    return knex.schema.hasTable("message_send_status").then(function (exists) {
        if (exists) {
            return knex.schema.dropTable("message_send_status");
        }
    });
};
