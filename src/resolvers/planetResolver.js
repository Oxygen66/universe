import { UserInputError } from 'apollo-server-koa';

const planetResolver = {
  Query: {
    planets: (parent, args, { dataSources: { planetAPI } }) => planetAPI.getAll(),
  },
  Planet: {
    id: ({ id }) => id,
    name: ({ name }) => name,
    code: ({ code }) => code.substr(0, 3),
    spaceCenters: ({ id }, { limit }, { dataSources: { spaceCenterAPI } }) => {
      if (limit > 10 || limit < 1) {
        throw new UserInputError('Limit must be between 1 and 10', {
          invalidArgs: 'limit',
        });
      }
      return spaceCenterAPI.getByPlanetIdAndLimit(id, limit);
    },
  },
};

export default planetResolver;
