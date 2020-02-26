import database from '../../database';

class SpaceCenter {
  #db = database;

  /**
   * Get all paginated by planet id
   * @param planetId
   * @param limit
   * @returns {Promise<Knex.QueryBuilder<TRecord, TResult>>}
   */
  async getByPlanetIdAndLimit(planetId, limit) {
    return this.#db('space_center')
      .where('planet_id', planetId)
      .limit(limit);
  }

  /**
   * Get by id
   * @param id
   * @returns {Promise<Knex.QueryBuilder<TRecord, DeferredKeySelection.AddUnionMember<UnwrapArrayMember<TResult>, undefined>>>}
   */
  async getById(id) {
    return this.#db('space_center')
      .where({ id })
      .first();
  }

  /**
   * Get by uid
   * @param uid
   * @returns {Promise<Knex.QueryBuilder<TRecord, DeferredKeySelection.AddUnionMember<UnwrapArrayMember<TResult>, undefined>>>}
   */
  async getByUid(uid) {
    return this.#db('space_center')
      .where({ uid })
      .first();
  }

  /**
   * Get all paginated
   * @param page
   * @param pageSize
   * @returns {Promise<Knex.QueryBuilder<TRecord, DeferredKeySelection<TRecord2, never>[]>>}
   */
  async getAllPaginated(page, pageSize) {
    return this.#db('space_center')
      .limit(pageSize)
      .offset((page - 1) * pageSize);
  }

  /**
   * Count all
   * @returns {Promise<Knex.QueryBuilder<TRecord, AggregationQueryResult<TResult, {[k in keyof TAliases]?: TValue}>>>}
   */
  async countAll() {
    return this.#db('space_center').count({ total: 'id' });
  }
}

export default SpaceCenter;
