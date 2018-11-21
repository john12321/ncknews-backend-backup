exports.up = function (knex, Promise) {
  console.log('creating user table...');
  return knex.schema.createTable('user', userTable => {
    userTable.increments('user_id').primary();
    userTable.string('username').notNullable();
    userTable.string('name').notNullable();
    userTable.string('avatar_url').notNullable();
  })
};

exports.down = function (knex, Promise) {
  console.log('dropping user table...');
  return knex.schema.dropTable('user');
};