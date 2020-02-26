import { merge } from 'lodash';
import planetResolver from './planetResolver';
import spaceCenterResolver from './spaceCenterResolver';
import paginationResolver from './paginationResolver';
import flightResolver from './flightResolver';

const resolvers = merge(
  planetResolver,
  spaceCenterResolver,
  paginationResolver,
  flightResolver,
);

export default resolvers;
