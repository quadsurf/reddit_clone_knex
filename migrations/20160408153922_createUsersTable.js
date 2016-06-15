
exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", function(table){
  	table.increments().primary();
  	table.string("fullName");
  	table.string("username");
  	table.text("imgUrl", "longtext");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
