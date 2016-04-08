exports.up = function(knex, Promise) {
  return knex.schema.createTable('tags', (t) => {
    t.increments();
    t.text('name');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('tags');
};
