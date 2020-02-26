import types from './types';
import query from './query';
import mutation from './mutation';
import inputs from './inputs';

const typeDefs = [
  ...types,
  ...inputs,
  query,
  mutation,
];

export default typeDefs;
