exports.up = function (knex, Promise) {
    return knex.schema.hasTable("admin_users").then(function (exists) {
        if (!exists) {
            knex.schema.createTable("admin_users", function (t) {
                t.increments("id").primary();
                t.string("email", 30);
                t.string("name", 20).defaultTo('');
                t.string("password", 20);
                t.string("send_message").defaultTo('');
                t.string("memo").defaultTo('');
                t.integer("sex", 1).defaultTo(0);
                t.boolean("is_enable", true).defaultTo(true);
                t.timestamp("created_at").defaultTo(knex.fn.now());
                t.index('email');
                t.index('name');
                t.index('password');
                t.index('send_message');
                t.index('memo');
                t.index('sex');
                t.index('is_enable');
                t.index('created_at');
            }).catch(function (e) {
                console.log(e);
            });
        } else {
            return new Error("The table already exists");
        }
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.hasTable("admin_users").then(function (exists) {
        if (exists) {
            return knex.schema.dropTable("admin_users");
        }
    });
};
