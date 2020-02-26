import { ApolloServer, gql } from 'apollo-server-koa';
import { createTestClient } from 'apollo-server-testing';
import Planet from '../src/models/Planet';
import SpaceCenter from '../src/models/SpaceCenter';
import Flight from '../src/models/Flight';
import typeDefs from '../src/typeDefs';
import resolvers from '../src/resolvers';
import Booking from '../src/models/Booking';

const planetAPI = new Planet();
const spaceCenterAPI = new SpaceCenter();
const flightAPI = new Flight();
const bookingAPI = new Booking();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    planetAPI, spaceCenterAPI, flightAPI, bookingAPI,
  }),
});

const CREATE_FLIGHT = gql`
    mutation scheduleFlight($flight: ScheduleFlightInput!) {
        scheduleFlight(flightInfo: $flight) {
            id
            code
            launchSite {
                name
                planet {
                    name
                }
            }
            landingSite {
                name
                planet {
                    name
                }
            }
            availableSeats
            seatCount
            departureAt
        }
    }
`;

describe('Mutations', () => {
  describe('scheduleFlight', () => {
    const fakeFlight = {
      id: 1,
      code: 'ddd99ffbca076ef4e188774eea6d4d05',
      departure_at: new Date('1970-01-01'),
      seat_count: 5,
      launching_site: 1,
      landing_site: 2,
    };

    beforeEach(() => {
      bookingAPI.getAllByFlightId = jest.fn(() => ([]));
      flightAPI.createFlight = jest.fn(() => [fakeFlight]);
      spaceCenterAPI.getById = jest.fn((id) => ({
        id,
        uid: `04c424d3-ff29-41b0-8d11-820c5e4c12b${id}`,
        name: `name${id}`,
        description: `description${id}`,
        planet_id: 1,
      }));
      planetAPI.getBySpaceCenterId = jest.fn(() => ({
        id: 1,
        name: 'test1',
        code: 'COD',
      }));
    });

    it('Create flight', async () => {
      const { mutate } = createTestClient(server);
      const flight = {
        launchSiteId: 1,
        landingSiteId: 2,
        departureAt: '1970-01-01',
        seatCount: 5,
      };
      const res = await mutate({
        mutation: CREATE_FLIGHT,
        variables: {
          flight,
        },
      });

      expect(res.errors).not.toBeTruthy();
      expect(res).toMatchSnapshot();
    });

    it('Create flight with same launchSiteId and landingSiteId throw error', async () => {
      const { mutate } = createTestClient(server);
      const res = await mutate({
        mutation: CREATE_FLIGHT,
        variables: {
          flight: {
            launchSiteId: 1,
            landingSiteId: 1,
            departureAt: '1970-01-01',
            seatCount: 5,
          },
        },
      });
      expect(res.errors).toBeTruthy();
      expect(res).toMatchSnapshot();
    });
  });
});
