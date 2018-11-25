exports.up = function (knex, Promise) {
  // console.log('creating article table...');
  return knex.schema.createTable('article', (articlesTable) => {
    articlesTable.increments('article_id').primary();
    articlesTable.string('title').notNullable();
    articlesTable.text('body', 'mediumtext');
    articlesTable.integer('votes').defaultTo(0);
    articlesTable.string('topic').references('topic.slug').notNullable();
    articlesTable.integer('user_id').references('user.user_id').unsigned();
    articlesTable.dateTime('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex, Promise) {
  // console.log('dropping article table...');
  return knex.schema.dropTable('article');
};
