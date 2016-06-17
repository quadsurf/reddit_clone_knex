
exports.up = function(knex, Promise) {
  return knex.schema.createTable("posts", function(table){
  	table.increments().primary();
    table.integer('user_id').unsigned().index().references('id').inTable('users').onDelete('cascade');
  	table.string("postTitle");
  	table.text("postBody");
  	table.text("imgUrl", "longtext");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('posts');
};
