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
    connection: '//pafevrjcxwunzs:e259e4941ce213ecdde3e91ee8c95923c375a4264f77188636d5f068e5c05f41@ec2-54-235-160-57.compute-1.amazonaws.com:5432/d70dp0hoh3p3n8',
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
