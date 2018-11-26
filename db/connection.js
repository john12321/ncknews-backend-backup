const ENV = process.env.NODE_ENV || 'development';
const config = ENV === 'production' ? {
  client: 'pg',
  connection: process.env.DATABASE_URL
} : require('../knexfile')[ENV];

// const knex = require('knex');
// const dbConnection = require('../knexfile');

// module.exports = knex(dbConnection);

module.exports = require('knex')(config);