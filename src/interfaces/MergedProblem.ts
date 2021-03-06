import { Contest } from './Contest';
import { Problem } from './Problem';
import { RankingProblem } from './RankingProblem';
import { Difficulty } from './Difficulty';

/** 問題の提出状況 */
export enum ProblemSolveStatus {
  /** 未 AC */
  Trying = 0,
  /** コンテスト後 AC */
  Solved = 1,
  /** コンテスト中 AC */
  Intime = 2,
  /** コンテスト前 AC */
  BeforeContest = 3,
}

/** 日時情報をパースしたコンテスト */
export interface ExtendedContest extends Contest {
  /** コンテスト開始日時 パース済み */
  readonly DateNum: number;
  /** コンテスト終了日時 パース済み */
  readonly EndDateNum: number;
}

/** コンテスト情報および解答状況をマージした問題 */
export interface MergedProblem extends Problem {
  /** 問題に対応するコンテスト情報 */
  readonly Contest?: ExtendedContest;
  /** 出題日時 パース済み */
  readonly DateNum: number;
  /** 最初に正答した日時 */
  readonly SolveDate?: string;
  /** 最初に正答した日時 パース済み */
  readonly SolveDateNum?: number;
  /** 最初に（リジャッジ前に）正答した日時 */
  readonly FirstSolveDate?: string;
  /** 最初に（リジャッジ前に）正答した日時 パース済み */
  readonly FirstSolveDateNum?: number;
  /** 問題の提出状況 */
  readonly SolveStatus: ProblemSolveStatus;
  /** difficulty */
  readonly Difficulty?: Difficulty;
  /** experimental difficulty かどうか */
  readonly Augmented?: boolean;
  /** コンテスト中の問題インデックス */
  readonly Index?: number;
}

/** コンテスト情報，解答状況，およびショートコード情報をマージした問題 */
export interface RankingMergedProblem extends MergedProblem {
  /** 最速実行時間コード */
  readonly FastestRankingProblem?: RankingProblem;
  /** ショートコード */
  readonly ShortestRankingProblem?: RankingProblem;
  /** 純ショートコード */
  readonly PureShortestRankingProblem?: RankingProblem;
  /** 検索用 コンテスト名 */
  readonly ContestName?: string;
  /** 検索用 最速実行時間コード保持ユーザ名 */
  readonly FastestRankingUserName?: string;
  /** 検索用 ショートコード保持ユーザ名 */
  readonly ShortestRankingUserName?: string;
  /** 検索用 純ショートコード保持ユーザ名 */
  readonly PureShortestRankingUserName?: string;
}
