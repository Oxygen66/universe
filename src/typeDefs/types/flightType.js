import { gql } from 'apollo-server-koa';

const flightType = gql`
    scalar DateTime
    
    type Flight {
        id: ID!
        code: String!
        launchSite: SpaceCenter!
        landingSite: SpaceCenter!
        departureAt: DateTime!
        seatCount: Int!
        availableSeats: Int!
    }
    
    type FlightsResult {
        pagination: Pagination!
        nodes: [Flight!]
    }
`;

export default flightType;
