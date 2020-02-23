import { gql } from 'apollo-server-koa';

const bookingType = gql`
    type Booking {
        id: ID!
        flight: Flight!
        seatCount: Int!
        email: String!
    }
`;

export default bookingType;
