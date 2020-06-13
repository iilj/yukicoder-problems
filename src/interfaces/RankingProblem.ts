import { ProblemNo } from './Problem';
import { UserId, UserName } from './User';
import { LangId } from './Language';

/** 問題 */
export interface RankingProblem {
  /** 提出ID */
  readonly SubmissionId: number;
  /** 提出時間（RFC 3339） */
  readonly TimeStamp: string;
  /** 問題No */
  readonly No: ProblemNo;
  /** 問題名 */
  readonly Title: string;
  /** 提出者ID */
  readonly SubmitterId: UserId;
  /** 提出者名 */
  readonly UserName: UserName;
  /** ソースコード長 */
  readonly Length: number;
  /** 問題タイプ */
  readonly LangId: LangId;
}
