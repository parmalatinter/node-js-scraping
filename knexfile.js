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
      directory:'./app/db/migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
        directory: './app/db/seeds'
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
      directory:'./app/db/migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
        directory: './app/db/seeds'
    },
    debug: false
  },
  heroku:{
    client: 'postgresql',
    connection: process.env.DATABASE_URL? process.env.DATABASE_URL : '',
    migrations: {
      directory:'./app/db/migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './app/db/seeds'
    },
    debug: false,
    ssl: true
  }
};
