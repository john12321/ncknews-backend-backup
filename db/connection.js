const knex = require('knex');
const dbConnection = require('../knexfile');

module.exports = knex(dbConnection);
