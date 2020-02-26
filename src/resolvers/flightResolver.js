import { UserInputError } from 'apollo-server-koa';

const flightResolver = {
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
};

export default flightResolver;
