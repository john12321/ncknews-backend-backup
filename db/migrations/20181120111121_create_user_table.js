exports.up = function (knex, Promise) {
  // console.log('creating users table...');
  return knex.schema.createTable('user', (usersTable) => {
    usersTable.increments('user_id').primary();
    usersTable.string('username').notNullable();
    usersTable.string('name').notNullable();
    usersTable.string('avatar_url').notNullable();
  });
};

exports.down = function (knex, Promise) {
  // console.log('dropping user table...');
  return knex.schema.dropTable('user');
};
