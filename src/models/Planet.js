import database from '../../database';

class Planet {
  #db = database;

  /**
   * Get all planets
   * @returns {Promise<Knex.QueryBuilder<TRecord, DeferredKeySelection<TRecord2, never>[]>>}
   */
  async getAll() {
    return this.#db('planet');
  }

  /**
   * Get a planet by space_center.id
   * @param id
   * @returns {Promise<Knex.QueryBuilder<TRecord, DeferredKeySelection.AddUnionMember<UnwrapArrayMember<TResult>, undefined>>>}
   */
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
