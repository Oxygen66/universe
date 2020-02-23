import { gql } from 'apollo-server-koa';

const spaceCenterType = gql`
  type SpaceCenter {
    id: ID!
    uid: String!
    name: String!
    description: String!
    planet: Planet!
    latitude: Float!
    longitude: Float!
  }
`;

export default spaceCenterType;
