import { merge } from 'lodash';
import planetResolver from './planetResolver';
import spaceCenterResolver from './spaceCenterResolver';
import paginationResolver from './paginationResolver';

const resolvers = merge(
  planetResolver,
  spaceCenterResolver,
  paginationResolver,
);

export default resolvers;
