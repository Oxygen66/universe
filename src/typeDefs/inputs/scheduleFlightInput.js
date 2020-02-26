import { gql } from 'apollo-server-koa';

const scheduleFlightInput = gql`
    input ScheduleFlightInput {
        launchSiteId: Int!
        landingSiteId: Int!
        departureAt: DateTime!
        seatCount: Int!
    }
`;

export default scheduleFlightInput;
