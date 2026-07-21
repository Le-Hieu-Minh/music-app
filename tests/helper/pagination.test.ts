import { getPagination } from "../../helper/pagination";

describe("getPagination", () => {
  it("returns first page defaults", () => {
    const result = getPagination({}, 25, 10);
    expect(result).toEqual({
      page: 1,
      limit: 10,
      totalPage: 3,
      skip: 0,
      total: 25
    });
  });

  it("calculates skip for page 2", () => {
    const result = getPagination({ page: "2" }, 25, 10);
    expect(result.page).toBe(2);
    expect(result.skip).toBe(10);
  });

  it("clamps invalid page to 1", () => {
    expect(getPagination({ page: "0" }, 10, 5).page).toBe(1);
    expect(getPagination({ page: "abc" }, 10, 5).page).toBe(1);
  });

  it("clamps page above totalPage", () => {
    const result = getPagination({ page: "99" }, 10, 5);
    expect(result.page).toBe(2);
    expect(result.totalPage).toBe(2);
  });

  it("handles zero total records", () => {
    const result = getPagination({ page: 1 }, 0, 12);
    expect(result.totalPage).toBe(1);
    expect(result.skip).toBe(0);
  });
});
