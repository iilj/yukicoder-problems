import { Problem } from './Problem';

/** 正答済み問題 */
export interface SolvedProblem extends Problem {
  /** 最初に正答された時間（RFC 3339） */
  readonly Date: string;
  /** 最初に（リジャッジ前に）ACした提出の情報かどうか */
  First: boolean;
}

/** ユーザーが最初に（リジャッジ前に）ACした問題 */
export type FirstSolvedProblem = SolvedProblem;
