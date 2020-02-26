import database from '../../database';

class Booking {
  #db = database;

  async getAllByFlightId(flightId) {
    return this.#db('booking')
      .where('flight_id', flightId);
  }

  async getById(id) {
    return this.#db('booking')
      .where({ id }).first();
  }

  async createBooking(seatCount, flightId, email) {
    return this.#db('booking').insert({
      seat_count: seatCount,
      flight_id: flightId,
      email,
    }).returning('*');
  }
}

export default Booking;
