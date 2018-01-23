import { semverCompare, SemverResult, minFwVersionCheck } from "../version";

describe("semver compare", () => {
  it("knows when RIGHT_IS_GREATER", () => {
    expect(semverCompare("3.1.6", "4.0.0"))
      .toBe(SemverResult.RIGHT_IS_GREATER);

    expect(semverCompare("2.1.6", "4.1.0"))
      .toBe(SemverResult.RIGHT_IS_GREATER);

    expect(semverCompare("4.1.6", "5.1.9"))
      .toBe(SemverResult.RIGHT_IS_GREATER);

    expect(semverCompare("1.1.9", "2.0.2"))
      .toBe(SemverResult.RIGHT_IS_GREATER);

    expect(semverCompare("", "1.0.0"))
      .toBe(SemverResult.RIGHT_IS_GREATER);
  });

  it("knows when LEFT_IS_GREATER", () => {
    expect(semverCompare("4.0.0", "3.1.6"))
      .toBe(SemverResult.LEFT_IS_GREATER);

    expect(semverCompare("4.1.0", "2.1.6"))
      .toBe(SemverResult.LEFT_IS_GREATER);

    expect(semverCompare("5.1.9", "4.1.6"))
      .toBe(SemverResult.LEFT_IS_GREATER);

    expect(semverCompare("2.0.2", "1.1.9"))
      .toBe(SemverResult.LEFT_IS_GREATER);

    expect(semverCompare("1.0.0", ""))
      .toBe(SemverResult.LEFT_IS_GREATER);
    expect(semverCompare("1.0.0", "x.y.z"))
      .toBe(SemverResult.LEFT_IS_GREATER);
    expect(semverCompare("x.y.z", "1.0.0"))
      .toBe(SemverResult.RIGHT_IS_GREATER);
  });
});

describe("minFwVersionCheck()", () => {
  it("firmware version meets or exceeds minimum", () => {
    expect(minFwVersionCheck("1.0.1R", "1.0.1")).toBeTruthy();
    expect(minFwVersionCheck("1.0.2F", "1.0.1")).toBeTruthy();
  });

  it("firmware version doesn't meet minimum", () => {
    expect(minFwVersionCheck("1.0.0R", "1.0.1")).toBeFalsy();
    expect(minFwVersionCheck(undefined, "1.0.1")).toBeFalsy();
    expect(minFwVersionCheck("1.0.0", "1.0.1")).toBeFalsy();
  });
});
