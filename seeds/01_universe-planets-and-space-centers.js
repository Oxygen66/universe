const planets = require('../doc/planets');
const spaceCenters = require('../doc/space-centers');

exports.seed = (knex) => knex('planet').del()
  .then(() => knex('planet').insert([...planets])
    .returning(['id', 'code'])
    .then((planetsInserted) => knex('space_center').insert(
      [...spaceCenters]
        .filter(({ planet_code: planetCode }) => planetsInserted
          .find(({ code }) => code === planetCode))
        .map(({
          planet_code: planetCode, ...spaceCentersRest
        }) => ({
          ...spaceCentersRest,
          planet_id: planetsInserted
            .find(({ code }) => code === planetCode).id,
        })),
    )));
