import { StatData } from "../types";

// TODO: 一般アクセサを生成するユーティリティを作りたい

export const statsAsConst = [
  {
    id: "actionPointsPerTurn",
    kind: "integer",
    name: "AP per Turn",
    shortName: "AP/T",
    range: { min: 0 },
  },
  {
    id: "agility",
    kind: "integer",
    name: "Agility",
    shortName: "AGI",
    range: { min: 1, max: 99 },
  },
  {
    id: "intelligence",
    kind: "integer",
    name: "Intelligence",
    shortName: "INT",
    range: { min: 1, max: 99 },
  },
  {
    id: "maxActionPoints",
    kind: "integer",
    name: "Max AP",
    shortName: "MAP",
    range: { min: 0 },
  },
  {
    id: "maxHp",
    kind: "integer",
    name: "Max HP",
    shortName: "MHP",
    range: { min: 1 },
  },
  {
    id: "maxHpRate",
    kind: "rate",
    name: "Max HP Rate",
    shortName: "MHPR",
    range: { min: 0.0 },
  },
  {
    id: "magicalAttackRate",
    kind: "rate",
    name: "Magical Attack Rate",
    shortName: "MAR",
    range: { min: 0.0 },
  },
  {
    id: "magicalDefenseRate",
    kind: "reductionRate",
    name: "Magical Defense Rate",
    shortName: "MDR",
  },
  {
    id: "physicalAttackRate",
    kind: "rate",
    name: "Physical Attack Rate",
    shortName: "PAR",
    range: { min: 0.0 },
  },
  {
    id: "physicalDefenseRate",
    kind: "reductionRate",
    name: "Physical Defense Rate",
    shortName: "PDR",
  },
  {
    id: "strength",
    kind: "integer",
    name: "Strength",
    shortName: "STR",
    range: { min: 1, max: 99 },
  },
] as const satisfies StatData[];

// TODO: 配列より辞書の方が使いやすそう: https://kasama-chenkaow.medium.com/typescript-convert-array-of-object-to-object-with-id-as-a-key-81d012ca70c5

export type StatDataId = (typeof statsAsConst)[number]["id"];

export const stats: StatData[] = statsAsConst;
