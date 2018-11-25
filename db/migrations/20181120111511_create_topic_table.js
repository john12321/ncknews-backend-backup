exports.up = function (knex, Promise) {
  // console.log('creating topics table...');
  return knex.schema.createTable('topic', (topicsTable) => {
    topicsTable.string('slug').unique();
    topicsTable.string('description');
  });
};

exports.down = function (knex, Promise) {
  // console.log('deleting topics table...');
  return knex.schema.dropTable('topic');
};
