const knex = require('knex');
const dbConnection = process.env.NODE_ENV === "test" ? "ncknews_test" : "ncknews";
const db = knex({
  client: "pg",
  connection: {
    host: "localhost",
    port: 5432,
    user: "",
    password: "",
    database: `${dbConnection}`

  }
});

module.exports = db;