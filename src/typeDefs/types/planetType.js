import { gql } from 'apollo-server-koa';

const planetType = gql`
  type Planet {
    id: ID!
    name: String!
    code: String!
    spaceCenters(limit: Int = 5): [SpaceCenter!]
  }
`;

export default planetType;
