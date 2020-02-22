import Koa from 'koa';
import { ApolloServer, gql } from 'apollo-server-koa';

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = new Koa();
server.applyMiddleware({ app });

// eslint-disable-next-line no-console
app.listen({ port: 3000 }, () => console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`));
