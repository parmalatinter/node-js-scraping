// Update with your config settings.

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'scraping-dev',
      user:     'postgres',
      password: 'postgres',
      host: 'localhost'
    },
    migrations: {
      directory:'./db/migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
        directory: './db//seeds'
    },
    debug: true
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'scraping-pro',
      user:     'postgres',
      password: 'postgres',
      host: 'localhost'
    },
    migrations: {
      directory:'./db/migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
        directory: './db/seeds'
    },
    debug: false
  }
};
