// Update with your config settings.

require('dotenv').config();
module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      connectionString: process.env.DATABASE_URL,
      timezone: 'UTC'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './migrations',
      tableName: 'appointment_calendar_knex_migrations'
    }
  },
  production: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 5432
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './migrations',
      tableName: 'appointment_calendar_knex_migrations'
    }
  }
}; 