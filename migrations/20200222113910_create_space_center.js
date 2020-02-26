const SPACE_CENTER_TABLE_NAME = 'space_center';

exports.up = (knex) => knex.schema.createTable(SPACE_CENTER_TABLE_NAME, (t) => {
  t.increments('id').unsigned().primary();
  t.uuid('uid').notNullable();
  t.string('name', 255).notNullable();
  t.text('description').notNullable();
  t.float('latitude').notNullable();
  t.float('longitude').notNullable();
  t.integer('planet_id').unsigned().notNullable();
  t.foreign('planet_id').references('id').inTable('planet')
    .onDelete('CASCADE')
    .onUpdate('CASCADE');
});

exports.down = (knex) => knex.schema.dropTable(SPACE_CENTER_TABLE_NAME);
