
exports.up = function(knex, Promise) {
  return knex.schema.createTable("comments", function(table){
  	table.increments().primary();
    table.integer('user_id').unsigned().index().references('id').inTable('users');
    table.integer('post_id').unsigned().index().references('id').inTable('posts');
  	table.text("commentBody");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('comments');
};
