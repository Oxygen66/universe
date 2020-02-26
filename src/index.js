import Koa from 'koa';
import { ApolloServer, AuthenticationError } from 'apollo-server-koa';
import typeDefs from './typeDefs';
import resolvers from './resolvers';
import Planet from './models/Planet';
import SpaceCenter from './models/SpaceCenter';
import Flight from './models/Flight';
import Booking from './models/Booking';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    planetAPI: new Planet(),
    spaceCenterAPI: new SpaceCenter(),
    flightAPI: new Flight(),
    bookingAPI: new Booking(),
  }),
  context: ({ ctx }) => {
    const token = ctx.request.header.authorization || null;

    if (token !== process.env.SECRET_JWT) {
      throw new AuthenticationError('You must be logged in');
    }
  },
});

const app = new Koa();
server.applyMiddleware({ app });

// eslint-disable-next-line no-console
app.listen({ port: 3000 }, () => console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`));
