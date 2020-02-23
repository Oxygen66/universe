import { merge } from 'lodash';
import helloResolvers from './helloResolver';

const resolvers = merge(
  helloResolvers,
);

export default resolvers;
