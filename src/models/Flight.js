import crypto from 'crypto';
import database from '../../database';

class Flight {
  #db = database;

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

  async getById(id) {
    return this.#db('flight')
      .where({ id }).first();
  }

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
