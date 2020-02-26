import { gql } from 'apollo-server-koa';

const bookingType = gql`
    type Booking {
        id: ID!
        flight: Flight!
        seatCount: Int!
        email: String!
    }
    
    type BookingsResult {
        pagination: Pagination!
        nodes: [Booking!]
    }
`;

export default bookingType;
