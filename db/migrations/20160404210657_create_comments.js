exports.up = function(knex, Promise) {
  return knex.schema.createTable('comments', (t)=>{
    t.increments();
    t.text("content");
    t.bigInteger("post_id").unsigned().index().references("id").inTable("posts").onDelete("cascade");
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('comments')
};
