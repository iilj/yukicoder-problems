/** 問題No */
export type ProblemNo = number;
/** 問題Id */
export type ProblemId = number;

/** 問題タイプ */
export enum ProblemType {
  /** 通常問題 */
  Normal = 0,
  /** 教育的問題 */
  Educational = 1,
  /** スコア形式問題 */
  Scoring = 2,
  /** ネタ問題 */
  Joke = 3,
}

/** 問題タイプのリスト */
export const ProblemTypes = [
  ProblemType.Normal,
  ProblemType.Educational,
  ProblemType.Scoring,
  ProblemType.Joke,
];

/** 問題レベルのリスト */
export const ProblemLevels = [0, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6] as const;

/** 問題レベル */
export type ProblemLevel = typeof ProblemLevels[number];

/** 問題 */
export interface Problem {
  /** 問題No */
  readonly No?: ProblemNo;
  /** 問題Id */
  readonly ProblemId: ProblemId;
  /** 問題名 */
  readonly Title: string;
  /** 作問者のユーザーId */
  readonly AuthorId: number;
  /** テスターのユーザーId */
  readonly TesterId: number;
  /** 問題レベル小数あり */
  readonly Level: ProblemLevel;
  /** 問題タイプ */
  readonly ProblemType: ProblemType;
  /** 問題のタグ カンマ区切り */
  readonly Tags: string;
  /** 最初に正答された時間（RFC 3339） */
  readonly Date?: string;
}