const FLIGHT_TABLE_NAME = 'flight';


exports.up = (knex) => knex.schema.createTable(FLIGHT_TABLE_NAME, (t) => {
  t.increments('id').unsigned().primary();
  t.string('code', 255).notNullable();
  t.dateTime('departure_at').defaultTo(knex.fn.now()).notNullable();
  t.integer('seat_count').notNullable();
  t.integer('launching_site').unsigned();
  t.foreign('launching_site').references('id').inTable('space_center')
    .onDelete('CASCADE')
    .onUpdate('CASCADE');
  t.integer('landing_site').unsigned();
  t.foreign('landing_site').references('id').inTable('space_center')
    .onDelete('CASCADE')
    .onUpdate('CASCADE');
});

exports.down = (knex) => knex.schema.dropTable(FLIGHT_TABLE_NAME);
