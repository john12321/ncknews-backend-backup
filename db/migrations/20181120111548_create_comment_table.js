exports.up = function (knex, Promise) {
  console.log('creating comment table...');
  return knex.schema.createTable('comment', commentTable => {
    commentTable.increments('comment_id').primary();
    commentTable.integer('user_id').references('user.user_id');
    commentTable.integer('article_id').references('article.article_id');
    commentTable.integer('votes').defaultTo(0);
    commentTable.dateTime('created_at').defaultTo(knex.fn.now());
    commentTable.text('body').notNullable();
  })
};

exports.down = function (knex, Promise) {
  console.log('dropping comment table...');
  return knex.schema.dropTable('comment');
};