import Koa from 'koa';
import { ApolloServer } from 'apollo-server-koa';
import typeDefs from './typeDefs';
import resolvers from './resolvers';
import Planet from './models/Planet';
import SpaceCenter from './models/SpaceCenter';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    planetAPI: new Planet(),
    spaceCenterAPI: new SpaceCenter(),
  }),
});

const app = new Koa();
server.applyMiddleware({ app });

// eslint-disable-next-line no-console
app.listen({ port: 3000 }, () => console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`));
