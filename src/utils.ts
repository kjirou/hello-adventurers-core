/**
 * ゲームの知識を前提としない共通処理をまとめたモジュール
 */

import { GetRandom, IdGenerator, RangedNumber } from "./types";

export const getRandomInteger = (getRandom: GetRandom, max: number): number =>
  Math.floor(getRandom() * (max + 1));

/**
 * Shuffle an array with the Fisher–Yates algorithm.
 *
 * Ref) https://www.30secondsofcode.org/js/s/shuffle/
 */
export const shuffleArray = <Element>(
  array: Element[],
  getRandom: GetRandom,
): Element[] => {
  const copied = array.slice();
  let m = copied.length;
  while (m) {
    const i = Math.floor(getRandom() * m);
    m--;
    [copied[m], copied[i]] = [copied[i], copied[m]];
  }
  return copied;
};

/**
 * 一意のIDを生成する
 *
 * - 1レッスンまたは1プロデュース毎に1インスタンスを生成して共有する
 * - TODO: データロードの際の始点の復元
 */
export const createIdGenerator = (): IdGenerator => {
  // 整数のオーバーフローは考えない、 Number.MAX_SAFE_INTEGER を超えることはなさそう
  let counter = 0;
  return () => {
    counter++;
    return `${counter}`;
  };
};

export const validateNumberInRange = (
  target: number,
  range: RangedNumber,
): boolean => {
  if ("min" in range && "max" in range) {
    return range.min <= target && target <= range.max;
  } else if ("min" in range) {
    return range.min <= target;
  } else if ("max" in range) {
    return target <= range.max;
  }
  throw new Error("Invalid range");
};

// type AnyObject<TValue> = { [key: string]: TValue };
// type StringKeys<T> = {
//   [K in keyof T]: T[K] extends string | number | symbol ? K : never;
// }[keyof T];
// const arrayToKeyObject = <
//   T extends Record<StringKeys<T>, string | number | symbol>,
//   TKeyName extends keyof Record<StringKeys<T>, string | number | symbol>,
// >(
//   array: T[],
//   key: TKeyName,
// ): Record<T[TKeyName], T> =>
//   Object.fromEntries(array.map((a) => [a[key], a])) as Record<T[TKeyName], T>;

const convertObjectArrayToDictionary = <
  Element extends Record<KeyPropertyName, string>,
  KeyPropertyName extends keyof Element = "id",
  AllKeys = [],
>(
  array: Element[],
  keyPropertyName: KeyPropertyName = "id",
) => {
  const dictionary: Record<Element[KeyPropertyName], Element> = {};
  for (const element of array) {
    dictionary[element[keyPropertyName]] = element;
  }
  return dictionary;
};
