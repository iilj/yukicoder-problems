import { UserId } from './User';

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
  /** 未証明問題 */
  Unproved = 4,
}

/** 問題タイプのリスト */
export const ProblemTypes = [
  ProblemType.Normal,
  ProblemType.Educational,
  ProblemType.Scoring,
  ProblemType.Joke,
  ProblemType.Unproved,
];

/** 問題レベルのリスト */
export const ProblemLevels = [
  0,
  1,
  1.5,
  2,
  2.5,
  3,
  3.5,
  4,
  4.5,
  5,
  5.5,
  6,
] as const;

/** 問題レベル */
export type ProblemLevel = typeof ProblemLevels[number];

/** 問題 */
export interface Problem {
  /** 問題No nullable */
  readonly No: ProblemNo | null;
  /** 問題Id */
  readonly ProblemId: ProblemId;
  /** 問題名 */
  readonly Title: string;
  /** 作問者のユーザーId */
  readonly AuthorId: UserId;
  /** テスターのユーザーId */
  readonly TesterId: UserId;
  /** 問題レベル小数あり */
  readonly Level: ProblemLevel;
  /** 問題タイプ */
  readonly ProblemType: ProblemType;
  /** 問題のタグ カンマ区切り */
  readonly Tags: string;
  /** 出題日時（RFC 3339） nullable */
  readonly Date: string | null;
}
