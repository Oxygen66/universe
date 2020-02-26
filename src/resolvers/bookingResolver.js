import { UserInputError } from 'apollo-server-koa';

const bookingResolver = {
  Mutation: {
    bookFlight: async (
      _,
      { bookingInfo: { seatCount, flightId, email } },
      { dataSources: { bookingAPI, flightAPI } },
    ) => {
      if (seatCount < 1) {
        throw new UserInputError('seatCount should be greater than 0', {
          invalidArgs: 'seatCount',
        });
      }

      const flight = await flightAPI.getById(flightId);

      const bookings = await bookingAPI.getAllByFlightId(flightId);
      const remainingSeats = [...bookings]
        .map((booking) => booking.seat_count)
        .reduce((previousValue, currentValue) => previousValue - currentValue, flight.seat_count);

      if ((remainingSeats - seatCount) < 0) {
        throw new UserInputError('seatCount must be less than the number of remaining seats', {
          invalidArgs: 'seatCount',
        });
      }

      const [bookingResult] = await bookingAPI.createBooking(seatCount, flightId, email);
      return bookingResult;
    },
  },
  Query: {
    booking: (_, { id }, { dataSources: { bookingAPI } }) => bookingAPI.getById(id),
    bookings: async (parent, { email, page, pageSize }, { dataSources: { bookingAPI } }) => {
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
        bookings: email
          ? await bookingAPI.getAllByEmailPaginated(email, page, pageSize)
          : await bookingAPI.getAllPaginated(page, pageSize),
        page,
        pageSize,
        email,
      };
    },
  },
  Booking: {
    id: (parent) => parent.id,
    seatCount: (parent) => parent.seat_count,
    email: (parent) => parent.email,
    flight: (parent, args, { dataSources: { flightAPI } }) => flightAPI.getById(parent.flight_id),
  },
  BookingsResult: {
    pagination: async ({ page, pageSize, email }, args, { dataSources: { bookingAPI } }) => {
      const [{ total }] = await (email
        ? bookingAPI.countByEmail(email)
        : bookingAPI.count()
      );
      return {
        total,
        pageSize,
        page,
      };
    },
    nodes: ({ bookings }) => bookings,
  },
};

export default bookingResolver;
