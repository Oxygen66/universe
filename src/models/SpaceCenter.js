import database from '../../database';

class SpaceCenter {
  #db;

  constructor() {
    this.#db = database;
  }

  async getByPlanetIdAndLimit(planetId, limit) {
    return this.#db('space_center')
      .where('planet_id', planetId)
      .limit(limit);
  }
}

export default SpaceCenter;
