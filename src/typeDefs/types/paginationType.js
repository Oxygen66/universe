import { gql } from 'apollo-server-koa';

const paginationType = gql`
    type Pagination {
        total: Int!
        page: Int!
        pageSize: Int!
    }
`;

export default paginationType;
