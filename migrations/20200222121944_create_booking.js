const BOOKING_TABLE_NAME = 'booking';


exports.up = (knex) => knex.schema.createTable(BOOKING_TABLE_NAME, (t) => {
  t.increments('id').unsigned().primary();
  t.integer('seat_count').unsigned().notNullable();
  t.string('email');
  t.integer('flight_id').unsigned();
  t.foreign('flight_id').references('id').inTable('flight')
    .onDelete('CASCADE')
    .onUpdate('CASCADE');
});

exports.down = (knex) => knex.schema.dropTable(BOOKING_TABLE_NAME);
