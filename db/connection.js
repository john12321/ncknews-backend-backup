const ENV = process.env.NODE_ENV || 'development';
const config = ENV === 'production' ? {
  client: 'pg',
  connection: `${process.env.DATABASE_URL}?SSL=true`,
}
  : require('../knexfile')[ENV];

module.exports = require('knex')(config);
