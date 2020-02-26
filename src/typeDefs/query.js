import { gql } from 'apollo-server-koa';

const query = gql`
  type Query {
    planets: [Planet!]!
    spaceCenters(
        page: Int = 1,
        pageSize: Int = 10
    ): SpaceCentersResult
    spaceCenter(
        id: Int
        uid: String
    ): SpaceCenter
    bookings(
        email: String
        page: Int = 1
        pageSize: Int = 10
    ): BookingsResult!
    booking(id: Int!): Booking
  }
`;

export default query;
