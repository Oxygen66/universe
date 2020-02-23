import { ApolloServer, gql } from 'apollo-server-koa';
import { createTestClient } from 'apollo-server-testing';
import Planet from '../src/models/Planet';
import SpaceCenter from '../src/models/SpaceCenter';
import typeDefs from '../src/typeDefs';
import resolvers from '../src/resolvers';

const planetAPI = new Planet();
const spaceCenterAPI = new SpaceCenter();

const GET_PLANETS = gql`
    query planets {
        planets {
            id
            name
            code
            spaceCenters {
                id
            }
        }
    }
`;

const GET_PLANETS_BY_LIMIT = gql`
    query planets($limit: Int!) {
        planets {
            id
            name
            code
            spaceCenters(limit: $limit) {
                id
            }
        }
    }
`;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({ planetAPI, spaceCenterAPI }),
});

describe('Queries', () => {
  beforeEach(() => {
    planetAPI.getAll = jest.fn(() => ([
      {
        id: 1,
        name: 'test1',
        code: 'CD1',
      },
      {
        id: 2,
        name: 'test2',
        code: 'CD',
      },
    ]));
    spaceCenterAPI.getByPlanetIdAndLimit = jest.fn((id, limit) => [...Array(limit)].map((_, i) => ({
      id: (id - 1) * limit + i + 1,
    })));
  });

  it('fetch list of planets', async () => {
    const { query } = createTestClient(server);
    const res = await query({
      query: GET_PLANETS,
    });
    res.data.planets.forEach((planet) => {
      expect(planet.spaceCenters).toHaveLength(5);
    });
    expect(res.errors).not.toBeTruthy();
    expect(res).toMatchSnapshot();
  });

  it('fetch list of planets with custom limit', async () => {
    const { query } = createTestClient(server);
    const limit = 7;
    const res = await query({
      query: GET_PLANETS_BY_LIMIT,
      variables: {
        limit,
      },
    });
    res.data.planets.forEach((planet) => {
      expect(planet.spaceCenters).toHaveLength(limit);
    });
    expect(res.errors).not.toBeTruthy();
    expect(res).toMatchSnapshot();
  });

  it('fetch list of planets with custom limit throw error (< 1)', async () => {
    const { query } = createTestClient(server);
    const res = await query({
      query: GET_PLANETS_BY_LIMIT,
      variables: {
        limit: 0,
      },
    });
    expect(res.errors).toBeTruthy();
    expect(res).toMatchSnapshot();
  });

  it('fetch list of planets with custom limit throw error (> 10)', async () => {
    const { query } = createTestClient(server);
    const res = await query({
      query: GET_PLANETS_BY_LIMIT,
      variables: {
        limit: 11,
      },
    });
    expect(res.errors).toBeTruthy();
    expect(res).toMatchSnapshot();
  });
});
