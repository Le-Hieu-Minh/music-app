import { convertToSlug } from "../../helper/convertToSlug";

describe("convertToSlug", () => {
  it("converts spaces to dashes and lowercases", () => {
    expect(convertToSlug("Hello World")).toBe("hello-world");
  });

  it("removes vietnamese accents", () => {
    expect(convertToSlug("Cắt đôi nỗi sầu")).toBe("cat-doi-noi-sau");
  });

  it("collapses multiple spaces", () => {
    expect(convertToSlug("a   b")).toBe("a-b");
  });
});
