import { gql } from 'apollo-server-koa';

const query = gql`
  type Query {
    planets: [Planet!]!
    spaceCenters(
        page: Int = 1,
        pageSize: Int = 10
    ): SpaceCentersResult
  }
`;

export default query;
