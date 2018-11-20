exports.up = function (knex, Promise) {
  console.log('creating user table...');
  return knex.schema.createTable('user', userTable => {
    userTable.increment('user_id').primary();
    userTable.string('username');
    userTable.string('user');
    userTable.string('avatar_url');
  })
};

exports.down = function (knex, Promise) {
  console.log('dropping user table...');
  return knex.schema.dropTable('user');
};