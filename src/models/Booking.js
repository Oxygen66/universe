import database from '../../database';

class Booking {
  #db = database;

  async getAllByFlightId(flightId) {
    return this.#db('booking')
      .where('flight_id', flightId);
  }

  async getAllPaginated(page, pageSize) {
    return this.#db('booking')
      .limit(pageSize)
      .offset((page - 1) * pageSize);
  }

  async getAllByEmailPaginated(email, page, pageSize) {
    return this.#db('booking')
      .where({ email })
      .limit(pageSize)
      .offset((page - 1) * pageSize);
  }

  async count() {
    return this.#db('booking').count({ total: 'id' });
  }

  async countByEmail(email) {
    return this.#db('booking').count({ total: 'id' }).where({ email });
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
