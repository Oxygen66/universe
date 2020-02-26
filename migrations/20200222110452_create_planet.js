const PLANET_TABLE_NAME = 'planet';

exports.up = (knex) => knex.schema.createTable(PLANET_TABLE_NAME, (t) => {
  t.increments('id').unsigned().primary();
  t.string('name', 255).notNullable();
  t.string('code', 255).notNullable();
});

exports.down = (knex) => knex.schema.dropTable(PLANET_TABLE_NAME);
