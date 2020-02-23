import { gql } from 'apollo-server-koa';

const query = gql`
  type Query {
    hello: String
  }
`;

export default query;
