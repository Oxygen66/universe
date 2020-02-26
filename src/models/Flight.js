import crypto from 'crypto';
import database from '../../database';

class Flight {
  #db = database;

  /**
   * Insert a flight
   * @param launchSiteId
   * @param landingSiteId
   * @param departureAt
   * @param seatCount
   * @returns {Promise<Knex.QueryBuilder<TRecord, DeferredKeySelection.SetSingle<DeferredKeySelection.Augment<UnwrapArrayMember<number[]>, TRecord, TKey>, false>[]>>}
   */
  async createFlight(launchSiteId, landingSiteId, departureAt, seatCount) {
    return this.#db('flight')
      .insert({
        launching_site: launchSiteId,
        landing_site: landingSiteId,
        departure_at: departureAt,
        seat_count: seatCount,
        code: crypto.randomBytes(16).toString('hex'),
      })
      .returning(['id', 'code', 'departure_at', 'seat_count', 'landing_site', 'launching_site']);
  }

  /**
   * Get a flight by Id
   * @param id
   * @returns {Promise<Knex.QueryBuilder<TRecord, DeferredKeySelection.AddUnionMember<UnwrapArrayMember<TResult>, undefined>>>}
   */
  async getById(id) {
    return this.#db('flight')
      .where({ id }).first();
  }

  /**
   * Get all flights paginated by parameters
   * @param page
   * @param pageSize
   * @param from
   * @param to
   * @param seatCount
   * @param departureDay
   * @returns {Promise<Knex.QueryBuilder<TRecord, DeferredKeySelection<TRecord2, never>[]>>}
   */
  async getAllPaginated(
    page,
    pageSize,
    from = null,
    to = null,
    seatCount = null,
    departureDay = null,
  ) {
    const query = this.#db('flight').limit(pageSize).offset((page - 1) * pageSize);

    if (from) {
      query.andWhere({ launching_site: from });
    }

    if (to) {
      query.andWhere({ landing_site: to });
    }

    if (seatCount) {
      query.andWhere('seat_count', '>=', seatCount);
    }

    if (departureDay) {
      query.andWhere('departure_at', departureDay);
    }

    return query;
  }

  /**
   * Count all flights paginated by parameters
   * @param from
   * @param to
   * @param seatCount
   * @param departureDay
   * @returns {Promise<Knex.QueryBuilder<TRecord, AggregationQueryResult<TResult, {[k in keyof TAliases]?: TValue}>>>}
   */
  async countAll(from = null, to = null, seatCount = null, departureDay = null) {
    const query = this.#db('flight').count({ total: 'id' });

    if (from) {
      query.andWhere({ launching_site: from });
    }

    if (to) {
      query.andWhere({ landing_site: to });
    }

    if (seatCount) {
      query.andWhere('seat_count', '>=', seatCount);
    }

    if (departureDay) {
      query.andWhere('departure_at', departureDay);
    }

    return query;
  }
}

export default Flight;
