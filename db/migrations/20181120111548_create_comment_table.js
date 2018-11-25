exports.up = function (knex, Promise) {
  // console.log('creating comment table...');
  return knex.schema.createTable('comment', (commentsTable) => {
    commentsTable.increments('comment_id').primary();
    commentsTable.integer('user_id').references('user.user_id');
    commentsTable.integer('article_id').references('article.article_id');
    commentsTable.integer('votes').defaultTo(0);
    commentsTable.dateTime('created_at').defaultTo(knex.fn.now());
    commentsTable.text('body').notNullable();
  });
};

exports.down = function (knex, Promise) {
  // console.log('dropping comment table...');
  return knex.schema.dropTable('comment');
};
