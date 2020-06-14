import { ProblemId } from './Problem';

/** コンテストID */
export type ContestId = number;

/** コンテスト */
export interface Contest {
  /** 一意な値 コンテストID */
  readonly Id: ContestId;
  /** コンテスト名 */
  readonly Name: string;
  /** コンテスト開始日時（RFC 3339） */
  readonly Date: string;
  /** コンテスト終了日時（RFC 3339） */
  readonly EndDate: string;
  /** 問題IDのリスト */
  readonly ProblemIdList: ProblemId[];
}
