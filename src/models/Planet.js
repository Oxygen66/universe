import database from '../../database';

class Planet {
  #db;

  constructor() {
    this.#db = database;
  }

  async getAll() {
    return this.#db('planet');
  }
}

export default Planet;
