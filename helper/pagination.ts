export interface PaginationResult {
  page: number;
  limit: number;
  totalPage: number;
  skip: number;
  total: number;
}

export const getPagination = (
  query: { page?: string | number },
  total: number,
  limitDefault: number = 12
): PaginationResult => {
  const limit = limitDefault > 0 ? limitDefault : 12;
  let page = parseInt(String(query.page || "1"), 10);
  if (Number.isNaN(page) || page < 1) {
    page = 1;
  }

  const totalPage = Math.max(1, Math.ceil(total / limit) || 1);
  if (page > totalPage) {
    page = totalPage;
  }

  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    totalPage,
    skip,
    total
  };
};
