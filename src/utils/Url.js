const BASE_URL = 'https://yukicoder.me';

export const formatContestUrl = (contestId) => `${BASE_URL}/contests/${contestId}`;

export const formatProblemUrl = (problemNo) => `${BASE_URL}/problems/no/${problemNo}`;

export const formatSubmissionUrl = (submissionId) => `${BASE_URL}/submissions/${submissionId}`;
