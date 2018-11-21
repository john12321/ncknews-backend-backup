exports.up = function (knex, Promise) {
  console.log('creating article table...');
  return knex.schema.createTable('article', articleTable => {
    articleTable.increments('article_id').primary();
    articleTable.string('title').notNullable();
    articleTable.text('body', 'mediumtext');
    articleTable.integer('votes').defaultTo(0);
    articleTable.string('topic').references('topic.slug').notNullable();
    articleTable.integer('user_id').references('user.user_id').unsigned();
    articleTable.dateTime('created_at').defaultTo(knex.fn.now());

  })
};

exports.down = function (knex, Promise) {
  console.log('dropping article table...');
  return knex.schema.dropTable('article');
};