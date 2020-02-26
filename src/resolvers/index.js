import { merge } from 'lodash';
import planetResolver from './planetResolver';
import spaceCenterResolver from './spaceCenterResolver';
import paginationResolver from './paginationResolver';
import flightResolver from './flightResolver';
import bookingResolver from './bookingResolver';

const resolvers = merge(
  planetResolver,
  spaceCenterResolver,
  paginationResolver,
  flightResolver,
  bookingResolver,
);

export default resolvers;
