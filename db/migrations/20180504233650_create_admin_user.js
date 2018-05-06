exports.up = function (knex, Promise) {
    return knex.schema.hasTable("admin_users").then(function (exists) {
        if (!exists) {
            knex.schema.createTable("admin_users", function (t) {
                t.string("id").primary();
                t.string("name", 20);
                t.string("password", 20);
                t.string("memo");
                t.integer("sex", 1);
                t.boolean("is_enable", true);
                t.timestamp("created_at");
                t.index('name');
                t.index('password');
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
