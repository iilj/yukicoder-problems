import { ContestId } from '../interfaces/Contest';
import { ProblemNo } from '../interfaces/Problem';

const BASE_URL = 'https://yukicoder.me';

export const formatContestUrl = (contestId: ContestId): string =>
  `${BASE_URL}/contests/${contestId}`;

export const formatProblemUrl = (problemNo: ProblemNo): string =>
  `${BASE_URL}/problems/no/${problemNo}`;

export const formatSubmissionUrl = (submissionId: number): string =>
  `${BASE_URL}/submissions/${submissionId}`;
