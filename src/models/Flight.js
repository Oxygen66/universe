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
}

export default Flight;
