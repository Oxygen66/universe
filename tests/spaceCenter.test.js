import { ApolloServer, gql } from 'apollo-server-koa';
import { createTestClient } from 'apollo-server-testing';
import Planet from '../src/models/Planet';
import SpaceCenter from '../src/models/SpaceCenter';
import typeDefs from '../src/typeDefs';
import resolvers from '../src/resolvers';

const planetAPI = new Planet();
const spaceCenterAPI = new SpaceCenter();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({ planetAPI, spaceCenterAPI }),
});

const GET_SPACE_CENTERS = gql`
    query spaceCenters {
        spaceCenters {
            pagination {
                total
                page
                pageSize
            }
            nodes {
                id
                uid
                name
                description
                latitude
                longitude
                planet {
                    id
                    name
                    code
                }
            }
        }
    }
`;

const GET_SPACE_CENTER_BY_CUSTOM_VARS = gql`
    query spaceCenters($page: Int!, $pageSize: Int!) {
        spaceCenters(page: $page, pageSize: $pageSize) {
            pagination {
                total
                page
                pageSize
            }
            nodes {
                id
                uid
                name
                description
                latitude
                longitude
                planet {
                    id
                    name
                    code
                }
            }
        }
    }
`;

describe('Queries', () => {
  it('should test', () => {
    expect(true).toBeTruthy();
  });

  describe('spaceCenters', () => {
    beforeEach(() => {
      planetAPI.getBySpaceCenterId = jest.fn(() => ({
        id: 1,
        name: 'test1',
        code: 'COD',
      }));
      spaceCenterAPI.getAllPaginated = jest
        .fn((page, pageSize) => [...Array(pageSize)].map((_, i) => {
          const id = (page - 1) * pageSize + i + 1;
          return ({
            id,
            uid: `uid${id}`,
            name: `name${id}`,
            description: `name${id}`,
            latitude: -1.0,
            longitude: -1.0,
            planet_id: 1,
          });
        }));
      spaceCenterAPI.countAll = jest.fn(() => [{ total: 1081 }]);
    });

    it('fetch space centers ', async () => {
      const { query } = createTestClient(server);
      const res = await query({
        query: GET_SPACE_CENTERS,
      });
      expect(res.errors).not.toBeTruthy();
      expect(res).toMatchSnapshot();
    });

    it('fetch space centers ', async () => {
      const { query } = createTestClient(server);
      const res = await query({
        query: GET_SPACE_CENTERS,
      });
      expect(res.errors).not.toBeTruthy();
      expect(res).toMatchSnapshot();
    });

    it('fetch spacers with custom page, pageSize', async () => {
      const { query } = createTestClient(server);
      const page = 7;
      const pageSize = 18;
      const res = await query({
        query: GET_SPACE_CENTER_BY_CUSTOM_VARS,
        variables: {
          page,
          pageSize,
        },
      });
      expect(res.data.spaceCenters.nodes).toHaveLength(pageSize);
      expect(res.errors).not.toBeTruthy();
      expect(res).toMatchSnapshot();
    });

    it('fetch spacers with custom page which throw error (page < 1)', async () => {
      const { query } = createTestClient(server);
      const page = 0;
      const pageSize = 18;
      const res = await query({
        query: GET_SPACE_CENTER_BY_CUSTOM_VARS,
        variables: {
          page,
          pageSize,
        },
      });
      expect(res.errors).toBeTruthy();
      expect(res).toMatchSnapshot();
    });

    it('fetch spacers with custom pageSize which throw error (pageSize > 100)', async () => {
      const { query } = createTestClient(server);
      const page = 1;
      const pageSize = 0;
      const res = await query({
        query: GET_SPACE_CENTER_BY_CUSTOM_VARS,
        variables: {
          page,
          pageSize,
        },
      });
      expect(res.errors).toBeTruthy();
      expect(res).toMatchSnapshot();
    });

    it('fetch spacers with custom pageSize which throw error (pageSize > 100)', async () => {
      const { query } = createTestClient(server);
      const page = 1;
      const pageSize = 118;
      const res = await query({
        query: GET_SPACE_CENTER_BY_CUSTOM_VARS,
        variables: {
          page,
          pageSize,
        },
      });
      expect(res.errors).toBeTruthy();
      expect(res).toMatchSnapshot();
    });
  });
});
