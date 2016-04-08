exports.up = function(knex, Promise) {
  return knex.schema.createTable('post_tags', (t) => {
    t.increments()
    t.bigInteger('post_id').unsigned().index().references('id').inTable('posts').onDelete('cascade')
    t.bigInteger('tag_id').unsigned().index().references('id').inTable('tags').onDelete('cascade')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('post_tags');
};
