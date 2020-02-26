import { gql } from 'apollo-server-koa';

const bookFlightInput = gql`
    input BookFlightInput {
        seatCount: Int = 1
        flightId: Int!
        email: String!
    }
`;

export default bookFlightInput;
