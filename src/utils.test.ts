import type { GetRandom } from "./types";
import {
  convertObjectArrayToDictionary,
  getRandomInteger,
  validateNumberInRange,
} from "./utils";

// Tabled Drivened Test にすると型引数が壊れるので、個別にテストケースを書く
describe("convertObjectArrayToDictionary", () => {
  test("概ね正しく動く", () => {
    expect(
      convertObjectArrayToDictionary(
        [
          { id: "a", value: 1 },
          { id: "b", value: 2 },
        ],
        "id",
      ),
    ).toStrictEqual({
      a: { id: "a", value: 1 },
      b: { id: "b", value: 2 },
    });
  });
  test("指定したキーが存在しない時、エラーを投げる", () => {
    expect(() => {
      convertObjectArrayToDictionary(
        [
          { id: "a", value: 1 },
          { idx: "b", value: 2 },
        ],
        "id",
      );
    }).toThrow();
  });
});
describe("getRandomInteger", () => {
  const testParameters: Array<{
    expected: ReturnType<typeof getRandomInteger>;
    max: Parameters<typeof getRandomInteger>[1];
    random: ReturnType<GetRandom>;
  }> = [
    {
      random: 0,
      max: 0,
      expected: 0,
    },
    {
      random: 0.999999,
      max: 0,
      expected: 0,
    },
    {
      random: 0,
      max: 1,
      expected: 0,
    },
    {
      random: 0.49,
      max: 1,
      expected: 0,
    },
    {
      random: 0.5,
      max: 1,
      expected: 1,
    },
    {
      random: 0.999999,
      max: 1,
      expected: 1,
    },
  ];
  test.each(testParameters)(
    "random: $random, max: $max => $expected",
    ({ random, max, expected }) => {
      expect(getRandomInteger(() => random, max)).toBe(expected);
    },
  );
});
describe("validateNumberInRange", () => {
  const testCases: Array<{
    args: Parameters<typeof validateNumberInRange>;
    expected: ReturnType<typeof validateNumberInRange>;
  }> = [
    {
      args: [1, { min: 1 }],
      expected: true,
    },
    {
      args: [0, { min: 1 }],
      expected: false,
    },
    {
      args: [1, { max: 1 }],
      expected: true,
    },
    {
      args: [2, { max: 1 }],
      expected: false,
    },
    {
      args: [1, { min: 1, max: 3 }],
      expected: true,
    },
    {
      args: [3, { min: 1, max: 3 }],
      expected: true,
    },
    {
      args: [0, { min: 1, max: 3 }],
      expected: false,
    },
    {
      args: [4, { min: 1, max: 3 }],
      expected: false,
    },
  ];
  test.each(testCases)(
    "$args.0, $args.1 => $expected",
    ({ args, expected }) => {
      expect(validateNumberInRange(...args)).toBe(expected);
    },
  );
});
