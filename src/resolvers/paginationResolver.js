const paginationResolver = {
  Pagination: {
    total: (parent) => parent.total,
    page: (parent) => parent.page,
    pageSize: (parent) => parent.pageSize,
  },
};

export default paginationResolver;
