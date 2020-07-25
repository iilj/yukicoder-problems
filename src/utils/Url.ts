import { ContestId } from '../interfaces/Contest';
import { ProblemNo, SubmissionId } from '../interfaces/Problem';

const BASE_URL = 'https://yukicoder.me';

export const formatContestUrl = (contestId: ContestId): string =>
  `${BASE_URL}/contests/${contestId}`;

export const formatContestLeaderboardUrl = (contestId: ContestId): string =>
  `${formatContestUrl(contestId)}/table`;

export const formatProblemUrl = (problemNo: ProblemNo): string =>
  `${BASE_URL}/problems/no/${problemNo}`;

export const formatProblemSubmissionsUrl = (problemNo: ProblemNo): string =>
  `${formatProblemUrl(problemNo)}/submissions`;

export const formatProblemStatisticsUrl = (problemNo: ProblemNo): string =>
  `${formatProblemUrl(problemNo)}/statistics`;

export const formatProblemEditorialUrl = (problemNo: ProblemNo): string =>
  `${formatProblemUrl(problemNo)}/editorial`;

export const formatSubmissionUrl = (submissionId: SubmissionId): string =>
  `${BASE_URL}/submissions/${submissionId}`;
