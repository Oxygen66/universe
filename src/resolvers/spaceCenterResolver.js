import { UserInputError } from 'apollo-server-koa';

const spaceCenterResolver = {
  Query: {
    spaceCenters: async (
      parent, { page, pageSize }, { dataSources: { spaceCenterAPI } },
    ) => {
      if (page < 1) {
        throw new UserInputError('Page must be greater than 1', {
          invalidArgs: 'page',
        });
      }

      if (pageSize < 1 || pageSize > 100) {
        throw new UserInputError('PageSize must be between 1 and 100', {
          invalidArgs: 'page',
        });
      }
      return ({
        spaceCenters: await spaceCenterAPI.getAllPaginated(page, pageSize),
        page,
        pageSize,
      });
    },
  },
  SpaceCentersResult: {
    // eslint-disable-next-line no-unused-vars
    pagination: async (
      { page, pageSize }, arg, { dataSources: { spaceCenterAPI } },
    ) => {
      const [{ total }] = await spaceCenterAPI.countAll();
      return {
        total,
        page,
        pageSize,
      };
    },
    nodes: (parent) => parent.spaceCenters,
  },
  SpaceCenter: {
    id: (parent) => parent.id,
    uid: (parent) => parent.uid,
    name: (parent) => parent.name,
    description: (parent) => parent.description,
    planet: (
      parent, args, { dataSources: { planetAPI } },
    ) => planetAPI.getBySpaceCenterId(parent.id),
    latitude: (parent) => parent.latitude,
    longitude: (parent) => parent.longitude,
  },
};

export default spaceCenterResolver;
