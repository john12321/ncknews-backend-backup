exports.up = function (knex, Promise) {
  return knex.schema.createTable('articles', (articlesTable) => {
    articlesTable.
      increments('article_id')
      .primary()
      .unsigned();
    articlesTable
      .string('title')
      .notNullable()
      .defaultTo(0);
    articlesTable
      .string('body', 10000)
      .notNullable();
    articlesTable
      .integer('votes')
      .notNullable()
      .defaultTo(0);
    articlesTable
      .string('topic')
      .references('topics.slug')
      .notNullable();
    articlesTable
      .integer('user_id')
      .references('users.user_id')
      .notNullable();
    articlesTable
      .date('created_at')
      .defaultTo(knex.fn.now(6));
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('articles');
};
