import { gql } from 'apollo-server-koa';

const query = gql`
  type Query {
    planets: [Planet!]!
  }
`;

export default query;
