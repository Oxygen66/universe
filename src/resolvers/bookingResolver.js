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
  },
  Booking: {
    id: (parent) => parent.id,
    seatCount: (parent) => parent.seat_count,
    email: (parent) => parent.email,
    flight: (parent, args, { dataSources: { flightAPI } }) => flightAPI.getById(parent.flight_id),
  },
};

export default bookingResolver;
