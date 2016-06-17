
exports.up = function(knex, Promise) {
  return knex.schema.dropTable('posts');
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('posts');
};
