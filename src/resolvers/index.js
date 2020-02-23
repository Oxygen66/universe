import { merge } from 'lodash';
import planetResolver from './planetResolver';

const resolvers = merge(
  planetResolver,
);

export default resolvers;
