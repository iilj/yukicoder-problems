import { ProblemNo, SubmissionId } from './Problem';
import { UserId, UserName } from './User';
import { LangId } from './Language';

/** 問題 */
export interface RankingProblem {
  /** 提出ID */
  readonly SubmissionId: SubmissionId;
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
  /** ソースコード長, nullable */
  readonly Length: number | null;
  /** 言語ID */
  readonly LangId: LangId;
}
