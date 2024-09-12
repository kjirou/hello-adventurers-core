/** Math.random と同じインターフェース */
export type GetRandom = () => number;

/**
 * 生成されるID
 *
 * - 概念をまたいで一意に振り出されるID
 */
export type GeneratedId = string;

export type IdGenerator = () => GeneratedId;

export type RangedNumber = Readonly<
  { min: number } | { max: number } | { max: number; min: number }
>;

/**
 * 能力値の雛形
 *
 * - 集計・テキスト化などの振る舞いを規格にしたもの
 * - 同じ能力は合計が可能
 */
export type StatTemplate = Readonly<
  | { kind: "chance"; default: number; value: number }
  | { kind: "integer"; default: number; range: RangedNumber; value: number }
  | { kind: "negativeFlag"; default: boolean; value: number }
  | { kind: "positiveFlag"; default: boolean; value: number }
  | { kind: "rate"; default: number; range: RangedNumber; value: number }
  | { kind: "reductionRate"; default: number; value: number }
>;

/**
 * ステータスデータ定義
 */
export type StatData = Readonly<
  {
    id: string;
    name: string;
    shortName: string;
  } & (
    | {
        kind: "chance";
      }
    | {
        kind: "everyFlag";
      }
    | {
        kind: "integer";
        range: RangedNumber;
      }
    | {
        kind: "someFlag";
      }
    | {
        kind: "rate";
        range: RangedNumber;
      }
    | {
        kind: "reductionRate";
      }
  )
>;

export type AbilityScores = Readonly<{
  agility: Extract<StatTemplate, { kind: "integer" }>;
  intelligence: Extract<StatTemplate, { kind: "integer" }>;
  strength: Extract<StatTemplate, { kind: "integer" }>;
}>;

/**
 * ステータス修正群
 *
 * - 職業・種族・スキル・装備・状態変化など様々な場所に定義される可能性があり、同じ値を集計して最終的なステータスを算出する
 * - 集計順により結果が変わってはいけない
 * - キーは StatData["id"] のいずれかと一致する
 * - 全ての StatData がここに含まれるわけではない
 *   - 例えば、Max HP は、最終的にゲーム上で使われる値だがこの値を直接変更することはできない。変更するときは maxHpRate を経由する。
 */
export type StatModifiers = Readonly<{
  actionPointsPerTurn: { value: number };
  maxActionPoints: { value: number };
  maxHpRate: { value: number };
  magicalAttackRate: { value: number };
  magicalDefenseRate: { value: number };
  physicalAttackRate: { value: number };
  physicalDefenseRate: { value: number };
}>;

/**
 * 個性
 *
 * - 冒険者と一部のNPCはこれを持つ
 */
export type Characteristics = Readonly<{
  personalName: string;
}>;

/**
 * スキルデータ定義
 */
export type SkillData = Readonly<{
  id: string;
}>;

/**
 * 専門データ定義
 *
 * - 職業や種族に属するものと共通のものがある
 * - 最大レベルは 9
 *   - 9 である理由は、表示上1桁で済む範囲でなるべく広い範囲にしたから。大き過ぎたら一律下げても良い。
 */
export type ExpertiseData = Readonly<{
  id: string;
  /**
   * レベル毎に取得するスキルデータID
   *
   * - 専門レベル1から9それぞれで取得するスキルデータID
   */
  skillDataIds: [
    SkillData["id"],
    SkillData["id"],
    SkillData["id"],
    SkillData["id"],
    SkillData["id"],
    SkillData["id"],
    SkillData["id"],
    SkillData["id"],
    SkillData["id"],
  ];
  stats?: Partial<StatModifiers>;
}>;

/**
 * 職業データ定義
 */
export type JobData = Readonly<{
  description: string;
  id: string;
  /**
   * 主専門
   *
   * - 職業名と同じID・名前の専門
   * - その職業のクリーチャーは必ずこの専門を持つ
   */
  mainExpertiseId: ExpertiseData["id"];
  name: string;
  stats?: Partial<StatModifiers>;
  /**
   * 副専門群
   *
   * - 冒険者の時のみ使用し、生成時にこの中の1-2個が選択される
   *   - ゲームバランス上は 2 個前提で考える。1 個は中盤までで慣れる前までのイメージ。
   * - その他のクリーチャーは無関係の予定、特にモンスターは無関係
   */
  subExpertiseIds?: [
    ExpertiseData["id"],
    ExpertiseData["id"],
    ExpertiseData["id"],
  ];
}>;

/**
 * 種族データ定義
 */
export type RaceData = Readonly<{
  description: string;
  expertiseIds?: ExpertiseData[];
  id: string;
  name: string;
  stats?: Partial<StatModifiers>;
}>;

/**
 * 状態変化データ定義
 *
 * - いわゆるバフ・デバフ
 */
export type StateChangeData = Readonly<{
  abilityScores?: AbilityScores;
  id: string;
  stats?: Partial<StatModifiers>;
}>;

/**
 * クリーチャーデータ定義
 */
export type CreatureData = Readonly<{
  jobId: JobData["id"];
  /**
   * 一般的な名前
   *
   * - 固有名詞ではなく、このデータを総じて示す名称
   *   - 「エルフの弓使い」「ゴブリンの戦士」「ケルベロス」など
   */
  name: string;
  raceId: RaceData["id"];
  stats?: Partial<StatModifiers>;
}>;

export type StateChange = {
  data: StateChangeData;
  id: GeneratedId;
  // TODO: 生成されてからの経過ターン、行われた行動数、などの経過情報を一律で持たせる。それ自体を型にしてもいいかも。
};

export const ModifierUpdateQuery = {};

/**
 * 待機中のクリーチャーの個体
 *
 * - クリーチャーとは、冒険者・モンスター・NPCなどの総称
 * - 待機中とは、冒険中ではない状態を指す
 * - 冒険者の勧誘時の冒険者情報・ステージに配置されているモンスターの情報などに使われる
 */
export type IdleCreature = Readonly<
  CreatureData & {
    /**
     * 主要能力値
     *
     * - 1-12 の範囲
     *   - 中央値は 4-6, 10 以上はレア
     *     - 前作ったゲームの比率はこれで、程良かったので踏襲してもいいかも
     *       Util.choiceRandomlyByRatio [
     *         [8, 1], [8, 2], [8, 3],
     *         [15, 4], [15, 5], [15, 6],
     *         [8, 7], [8, 8], [8, 9],
     *         [4, 10], [2, 11], [1, 12],
     *       ]
     * - 各所への影響が高い値であり、あまり上がらないようにする。最後まで使っても 3, 4 上昇くらいのイメージ。
     */
    abilityScores: AbilityScores;
    id: GeneratedId;
    /**
     * レベル
     *
     * - クリーチャーとしての基礎能力を表現する
     * - 1以上の整数、最大値はない、ゲーム最後は11から21くらいにする予定
     * - 値に比例して、職業熟練度・HP・シールド・各種ダメージなどが上昇する
     *   - 「いくら成長してもレベルが低いと難しい」みたいなストッパーの役割を持たせたいので、なるべくレベルに連動できそうな値はしておきたい
     *   - なお、一方で、契約中の成長システムにより上昇する値は、ある特定の値についてレベル・主要能力値を基礎値としての乗算的な関係にする
     *     - 注目させた点の増加分を大きくして、プレイヤーへの報酬としての満足度を上げるためである
     * - 冒険者生成後に上昇することは基本的にはない
     */
    level: number;
    /**
     * 一般的な名前
     *
     * - 固有名詞ではなく、このデータを総じて示す名称
     *   - 「エルフの弓使い」「ゴブリンの戦士」「ケルベロス」など
     */
    name: string;
    stats?: Partial<StatModifiers>;
  }
>;

/**
 * 待機中のパーティ
 *
 * - パーティへ入ることとギルドへ加入することは等しい
 */
export type IdleParty = Readonly<{
  id: GeneratedId;
  idleCreatureIds: IdleCreature["id"][];
}>;

/**
 * クリーチャー
 *
 * - 冒険中の冒険者・モンスター・NPCなど
 * - 概ね IdleCreature のプロパティ群を複製することで冒険開始時に生成され、冒険終了時に削除される
 * - この状態に対して行う振る舞いが多く、テストの都合上、値としてなるべく独立させたい
 */
export type Creature = Readonly<{
  abilityScores: AbilityScores;
  /**
   * ID
   *
   * - 少なくとも、冒険中に存在する Creature インスタンス群を通して一意の値
   *   - 実際は、IdleCreature["id"] をコピーする
   */
  id: GeneratedId;
  job: JobData;
  level: IdleCreature["level"];
  modifiers: StateChange[];
  name: string;
  race: RaceData;
}>;

export type Party = Readonly<{
  creatures: Creature[];
}>;

export type GamePlay = Readonly<{
  getRandom: GetRandom;
  idGenerator: IdGenerator;
}>;
