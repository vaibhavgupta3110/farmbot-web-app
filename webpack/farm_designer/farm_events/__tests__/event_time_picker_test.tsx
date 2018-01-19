import { utcToBotTime, botTimeToUtc } from "../event_time_picker";

describe("utcToBotTime", () => {
  const testCases = [
    { before: "01:51", offset: -12, after: "13:51" },
    { before: "05:16", offset: -8, after: "21:16" },
    { before: "07:55", offset: -5, after: "02:55" },
    { before: "12:43", offset: 10, after: "22:43" },
    { before: "12:51", offset: -3, after: "09:51" },
    { before: "14:12", offset: 8, after: "22:12" },
    { before: "14:46", offset: 10, after: "00:46" },
    { before: "15:34", offset: 4, after: "19:34" },
    { before: "17:09", offset: 9, after: "02:09" },
    { before: "23:11", offset: 3, after: "02:11" }
  ];

  it("adjusts local time to bot time", () => {
    testCases
      .map(tc => expect(utcToBotTime(tc.before, tc.offset)).toBe(tc.after));
  });

  it("reverses times, also.", () => {
    testCases
      .map(tc => expect(botTimeToUtc(tc.after, tc.offset)).toBe(tc.before));
  });
});
