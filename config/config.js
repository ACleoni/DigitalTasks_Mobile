module.exports = {
  database: {
    "development": {
      "username": process.env.USER,
      "password": null,
      "database": "digitaltasks_database_development",
      "host": "127.0.0.1",
      "dialect": "postgres"
    },
    "test": {
      "username": process.env.USER,
      "password": null,
      "database": "digitaltasks_database_test",
      "host": "127.0.0.1",
      "dialect": "postgres"
    },
    "production": {
      "username": process.env.USER,
      "password": process.env.PASSWORD,
      "database": process.env.DATABASENAME,
      "host": process.env.HOST,
      "dialect": "postgres"
    }
  },
  session: {
    "tokenExpSec": 0,
    "tokenExpMin": 0,
    "tokenExpHours": 4
  },
  base: {
    "url": process.env.URI || `localhost:${process.env.PORT}` 
  }
}
