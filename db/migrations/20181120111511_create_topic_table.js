exports.up = function (knex, Promise) {
  console.log('creating topic table...');
  return knex.schema.createTable('topic', topicTable => {
    topicTable.string('slug').unique();
    topicTable.string('description');
  })

};

exports.down = function (knex, Promise) {
  console.log('deleting topic table...');
  return knex.schema.dropTable('topic');
};