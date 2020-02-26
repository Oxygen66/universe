import database from '../../database';

class Planet {
  #db = database;

  async getAll() {
    return this.#db('planet');
  }

  async getBySpaceCenterId(id) {
    return this.#db('planet')
      .select('planet.*')
      .innerJoin(
        'space_center',
        'space_center.planet_id',
        'planet.id',
      )
      .where('space_center.id', id)
      .first();
  }
}

export default Planet;
