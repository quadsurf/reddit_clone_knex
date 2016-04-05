exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', (t)=> {
    t.increments();
    t.text('username')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
};
