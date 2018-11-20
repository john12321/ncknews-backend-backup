exports.up = function (knex, Promise) {
  console.log('creating comment table...');
  return knex.schema.createTable('comment', commentTable => {
    commentTable.increment('comment_id').primary();
    commentTable.integer('user_id').references('article.user_id');
    commentTable.integer('votes').defaultTo(0);
    commentTable.dateTime('created_at').defaultTo(knex.fn.now());
  })
};

exports.down = function (knex, Promise) {

};