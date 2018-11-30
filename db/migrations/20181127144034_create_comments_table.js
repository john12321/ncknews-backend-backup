exports.up = function (knex, Promise) {
  return knex.schema.createTable('comments', (commentsTable) => {
    commentsTable.increments('comment_id').primary();
    commentsTable.integer('user_id').references('users.user_id');
    commentsTable.integer('article_id').references('articles.article_id')
      .notNullable().onDelete('CASCADE');
    commentsTable.integer('votes').defaultTo(0);
    commentsTable.date('created_at').defaultTo(knex.fn.now(6));
    commentsTable.string('body', 10000).notNullable();
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('comments');
};
