import { gql } from 'apollo-server-koa';

const mutation = gql`
    type Mutation {
        scheduleFlight(flightInfo: ScheduleFlightInput!): Flight!
    }
`;

export default mutation;
