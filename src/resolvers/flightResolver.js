import { UserInputError } from 'apollo-server-koa';

const flightResolver = {
  Query: {
    flight: (parent, { id }, { dataSources: { flightAPI } }) => flightAPI.getById(id),
    flights:
      async (
        parent,
        {
          page, pageSize, seatCount, from, to, departureDay,
        },
        { dataSources: { flightAPI } },
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

        return {
          flights: await flightAPI
            .getAllPaginated(page, pageSize, from, to, seatCount, departureDay),
          page,
          pageSize,
          from,
          to,
          seatCount,
          departureDay,
        };
      },
  },
  Mutation: {
    scheduleFlight:
      async (
        _,
        {
          flightInfo: {
            launchSiteId,
            landingSiteId,
            departureAt,
            seatCount,
          },
        },
        { dataSources: { flightAPI } },
      ) => {
        if (landingSiteId === launchSiteId) {
          throw new UserInputError('landingSiteId and landingSiteId cannot be the same', {
            invalidArgs: [
              'launchSiteId', 'landingSiteId',
            ],
          });
        }

        if (!departureAt) {
          throw new UserInputError('departureAt must be a valid ISO date', {
            invalidArgs: 'departureAt',
          });
        }

        const [flightResult] = await flightAPI
          .createFlight(launchSiteId, landingSiteId, departureAt, seatCount);
        return flightResult;
      },
  },
  Flight: {
    id: (parent) => parent.id,
    code: (parent) => parent.code,
    departureAt: (parent) => parent.departure_at,
    seatCount: (parent) => parent.seat_count,
    launchSite: (
      parent, args, { dataSources: { spaceCenterAPI } },
    ) => spaceCenterAPI.getById(parent.launching_site),
    landingSite: (
      parent, args, { dataSources: { spaceCenterAPI } },
    ) => spaceCenterAPI.getById(parent.landing_site),
    availableSeats: async (
      { id, seat_count: seatCount }, args, { dataSources: { bookingAPI } },
    ) => {
      const bookings = await bookingAPI.getAllByFlightId(id);
      return [...bookings]
        .map((booking) => booking.seat_count)
        .reduce((previousValue, currentValue) => previousValue - currentValue, seatCount);
    },
  },
  FlightsResult: {
    pagination: async (
      {
        page, pageSize, from, to, seatCount, departureDay,
      },
      args,
      { dataSources: { flightAPI } },
    ) => {
      const [{ total }] = await flightAPI.countAll(from, to, seatCount, departureDay);
      return {
        total,
        page,
        pageSize,
      };
    },
    nodes: (parent) => parent.flights,
  },
};

export default flightResolver;
