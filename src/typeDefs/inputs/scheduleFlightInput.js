import { gql } from 'apollo-server-koa';

const scheduleFlightInput = gql`
    input ScheduleFlightInput {
        launchSiteId: Int!
        landingSiteId: Int!
        departureAt: String!
        seatCount: Int!
    }
`;

export default scheduleFlightInput;
