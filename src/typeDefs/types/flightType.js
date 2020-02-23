import { gql } from 'apollo-server-koa';

const flightType = gql`
    type Flight {
        id: ID!
        code: String!
        launchSite: SpaceCenter!
        landingSite: SpaceCenter!
        departureAt: String!
        seatCount: Int!
        availableSeats: Int!
    }
`;

export default flightType;
