import database from '../../database';

class SpaceCenter {
  #db = database;

  async getByPlanetIdAndLimit(planetId, limit) {
    return this.#db('space_center')
      .where('planet_id', planetId)
      .limit(limit);
  }

  async getAllPaginated(page, pageSize) {
    return this.#db('space_center')
      .limit(pageSize)
      .offset((pageSize - 1) * page);
  }

  async countAll() {
    return this.#db('space_center').count({ total: 'id' });
  }
}

export default SpaceCenter;
