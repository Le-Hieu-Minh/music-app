import {
  generateRandomString,
  generateRandomNumber
} from "../../helper/generate";

describe("generate helpers", () => {
  it("generateRandomString returns requested length", () => {
    expect(generateRandomString(10)).toHaveLength(10);
    expect(generateRandomString(0)).toHaveLength(0);
  });

  it("generateRandomString uses alphanumeric chars", () => {
    expect(generateRandomString(20)).toMatch(/^[A-Za-z0-9]+$/);
  });

  it("generateRandomNumber returns only digits", () => {
    const otp = generateRandomNumber(8);
    expect(otp).toHaveLength(8);
    expect(otp).toMatch(/^\d+$/);
  });
});
