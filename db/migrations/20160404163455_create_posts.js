exports.up = function(knex, Promise) {
  return knex.schema.createTable('posts', (t)=>{
    t.increments();
    t.text("title");
    t.text("body");
    t.bigInteger("user_id").unsigned().index().references('id').inTable('users').onDelete('cascade');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('posts');
};
