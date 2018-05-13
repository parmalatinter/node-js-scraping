exports.up = function (knex, Promise) {
    return knex.schema.hasTable("scraping_user_info_status").then(function (exists) {
        if (!exists) {
            knex.schema.createTable("scraping_user_info_status", function (t) {
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
    return knex.schema.hasTable("scraping_user_info_status").then(function (exists) {
        if (exists) {
            return knex.schema.dropTable("scraping_user_info_status");
        }
    });
};