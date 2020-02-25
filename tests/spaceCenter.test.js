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

const GET_SPACE_CENTER_WITHOUT_ARGS = gql`
    query spaceCenter {
        spaceCenter {
            id
            uid
            name
            description
            planet {
                id
                name
                code
            }
        }
    }
`;

const GET_SPACE_CENTER = gql`
    query spaceCenter($id: Int, $uid: String) {
        spaceCenter(id: $id, uid: $uid) {
            id
            uid
            name
            description
            planet {
                id
                name
                code
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

  describe('spaceCenter', () => {
    const spaceCenter = {
      id: '1082',
      uid: '04c424d3-ff29-41b0-8d11-820c5e4c12b8',
      name: 'Kassulke Islands Space Center',
      description: 'Ab omnis ex laborum voluptatem voluptate et numquam. Sapiente aliquam unde recusandae. Nihil omnis quod. Voluptatem consequuntur molestiae dolores quibusdam et officiis.',
      planet: {
        id: '16',
        name: 'Mercury',
        code: 'MER',
      },
    };

    beforeEach(() => {
      spaceCenterAPI.getById = jest
        .fn((id) => (parseInt(spaceCenter.id, 10) === parseInt(id, 10) ? spaceCenter : null));
      spaceCenterAPI.getByUid = jest
        .fn((uid) => (spaceCenter.uid === uid ? spaceCenter : null));
      planetAPI.getBySpaceCenterId = jest.fn(() => spaceCenter.planet);
    });

    it('should throw error without id uid', async () => {
      const { query } = createTestClient(server);
      const res = await query({
        query: GET_SPACE_CENTER_WITHOUT_ARGS,
      });

      expect(res.errors).toBeTruthy();
      expect(res).toMatchSnapshot();
    });

    it('should throw error with id AND uid', async () => {
      const { query } = createTestClient(server);
      const res = await query({
        query: GET_SPACE_CENTER,
        variables: {
          id: 1,
          uid: '04c424d3-ff29-41b0-8d11-820c5e4c12b8',
        },
      });

      expect(res.errors).toBeTruthy();
      expect(res).toMatchSnapshot();
    });

    it('should throw error with bad uid', async () => {
      const { query } = createTestClient(server);
      const res = await query({
        query: GET_SPACE_CENTER,
        variables: {
          uid: '04c424d3-ff29-41b01-8d11-820c5e4c12b8',
        },
      });

      expect(res.errors).toBeTruthy();
      expect(res).toMatchSnapshot();
    });

    it('fetch by uid (exist)', async () => {
      const { query } = createTestClient(server);
      const uid = '04c424d3-ff29-41b0-8d11-820c5e4c12b8';
      const res = await query({
        query: GET_SPACE_CENTER,
        variables: {
          uid,
        },
      });

      expect(res.data.spaceCenter).toEqual(spaceCenter);
      expect(res).toMatchSnapshot();
    });

    it('fetch by uid (not exist)', async () => {
      const { query } = createTestClient(server);
      const uid = '04c424d3-ff29-4d1b0-8d11-820c5e4c12b8';
      const res = await query({
        query: GET_SPACE_CENTER,
        variables: {
          uid,
        },
      });

      expect(res.data.spaceCenter).toBeNull();
      expect(res).toMatchSnapshot();
    });

    it('fetch by id (exist)', async () => {
      const { query } = createTestClient(server);
      const id = 1082;
      const res = await query({
        query: GET_SPACE_CENTER,
        variables: {
          id,
        },
      });

      expect(res.data.spaceCenter).toEqual(spaceCenter);
      expect(res).toMatchSnapshot();
    });

    it('fetch by id (not exist)', async () => {
      const { query } = createTestClient(server);
      const id = 1083;
      const res = await query({
        query: GET_SPACE_CENTER,
        variables: {
          id,
        },
      });

      expect(res.data.spaceCenter).toBeNull();
      expect(res).toMatchSnapshot();
    });
  });
});
