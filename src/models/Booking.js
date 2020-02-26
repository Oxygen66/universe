import database from '../../database';

class Booking {
  #db = database;

  /**
   * Get all bookings by flight_id
   * @param flightId
   * @returns {Promise<Knex.QueryBuilder<TRecord, TResult>>}
   */
  async getAllByFlightId(flightId) {
    return this.#db('booking')
      .where('flight_id', flightId);
  }

  /**
   * Get all bookings paginated
   * @param page
   * @param pageSize
   * @returns {Promise<Knex.QueryBuilder<TRecord, DeferredKeySelection<TRecord2, never>[]>>}
   */
  async getAllPaginated(page, pageSize) {
    return this.#db('booking')
      .limit(pageSize)
      .offset((page - 1) * pageSize);
  }

  /**
   * Get all bookings paginated and by email
   * @param email
   * @param page
   * @param pageSize
   * @returns {Promise<Knex.QueryBuilder<TRecord, TResult>>}
   */
  async getAllByEmailPaginated(email, page, pageSize) {
    return this.#db('booking')
      .where({ email })
      .limit(pageSize)
      .offset((page - 1) * pageSize);
  }

  /**
   * Count all bookings
   * @returns {Promise<Knex.QueryBuilder<TRecord, AggregationQueryResult<TResult, {[k in keyof TAliases]?: TValue}>>>}
   */
  async count() {
    return this.#db('booking').count({ total: 'id' });
  }

  /**
   * Count all bookings by email
   * @param email
   * @returns {Promise<Knex.QueryBuilder<TRecord, TResult>>}
   */
  async countByEmail(email) {
    return this.#db('booking').count({ total: 'id' }).where({ email });
  }

  /**
   * Get booking by id
   * @param id
   * @returns {Promise<Knex.QueryBuilder<TRecord, DeferredKeySelection.AddUnionMember<UnwrapArrayMember<TResult>, undefined>>>}
   */
  async getById(id) {
    return this.#db('booking')
      .where({ id }).first();
  }

  /**
   * Insert a new booking
   * @param seatCount
   * @param flightId
   * @param email
   * @returns {Promise<Knex.QueryBuilder<TRecord, DeferredKeySelection<TRecord, never>[]>>}
   */
  async createBooking(seatCount, flightId, email) {
    return this.#db('booking').insert({
      seat_count: seatCount,
      flight_id: flightId,
      email,
    }).returning('*');
  }
}

export default Booking;
