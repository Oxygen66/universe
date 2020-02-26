import database from '../../database';

class Booking {
  #db = database;

  async getAllByFlightId(flightId) {
    return this.#db('booking')
      .where('flight_id', flightId);
  }
}

export default Booking;
