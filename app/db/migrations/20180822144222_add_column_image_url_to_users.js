exports.up = function(knex, Promise) {
    return knex.schema.table('users', function(t) {
        t.string('image_url', 100).defaultTo(''); //画像URL
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('users', function(t) {
        t.dropColumn('image_url');
    });
};