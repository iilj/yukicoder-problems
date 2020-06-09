import { Problem } from './Problem';

/** 正答済み問題 */
export interface SolvedProblem extends Problem {
  /** 最初に正答された時間（RFC 3339） */
  readonly Date: string;
}
