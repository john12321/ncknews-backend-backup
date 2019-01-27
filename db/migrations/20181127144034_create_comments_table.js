exports.up = function (knex, Promise) {
  return knex.schema.createTable('comments', (commentsTable) => {
    commentsTable
      .increments('comment_id')
      .primary()
      .unsigned();
    commentsTable
      .integer('user_id')
      .references('users.user_id')
      .notNullable()
      .onDelete('CASCADE');
    commentsTable
      .integer('article_id')
      .references('articles.article_id')
      .notNullable()
      .onDelete('CASCADE');
    commentsTable
      .integer('votes')
      .defaultTo(0)
      .notNullable();
    commentsTable
      .date('created_at')
      .defaultTo(knex.fn.now())
      .notNullable();
    commentsTable
      .string('body', 10000)
      .notNullable();
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('comments');
};
