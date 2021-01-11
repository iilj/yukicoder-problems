import { Contest, ContestId } from '../interfaces/Contest';
import { Problem, ProblemId, ProblemNo } from '../interfaces/Problem';
import { SolvedProblem, FirstSolvedProblem } from '../interfaces/SolvedProblem';
import { RankingProblem } from '../interfaces/RankingProblem';
import {
  MergedProblem,
  ExtendedContest,
  ProblemSolveStatus,
  RankingMergedProblem,
} from '../interfaces/MergedProblem';
import { Difficulties } from '../interfaces/Difficulty';

export const mergeSolveStatus = (
  problems: Problem[],
  contests: Contest[],
  problemContestMap: Map<ProblemId, ContestId>,
  solvedProblemsMap: Map<ProblemId, SolvedProblem>,
  firstSolvedProblemsMap: Map<ProblemId, FirstSolvedProblem>,
  difficulties: Difficulties
): MergedProblem[] => {
  const extendedContestMap = contests.reduce(
    (map, contest) =>
      map.set(contest.Id, {
        ...contest,
        DateNum: Date.parse(contest.Date),
        EndDateNum: Date.parse(contest.EndDate),
      }),
    new Map<ContestId, ExtendedContest>()
  );
  const problemIndexMap = contests.reduce((map, contest) => {
    contest.ProblemIdList.forEach((pid, i) => {
      if (pid < 0) return;
      map.set(pid, i);
    });
    return map;
  }, new Map<ProblemId, number>());
  const mergedProblems = problems.map(
    (problem): MergedProblem => {
      const DateNum = Date.parse(problem.Date as string);
      const contestId = problemContestMap.get(problem.ProblemId);
      const extendedContest = contestId
        ? extendedContestMap.get(contestId)
        : undefined;
      const solvedProblem = solvedProblemsMap.get(problem.ProblemId);
      const firstSolvedProblem = firstSolvedProblemsMap.get(problem.ProblemId);
      const Difficulty =
        problem.ProblemId in difficulties
          ? difficulties[problem.ProblemId][0]
          : undefined;
      const Augmented =
        problem.ProblemId in difficulties
          ? difficulties[problem.ProblemId][3]
          : undefined;
      if (!extendedContest) {
        // コンテスト情報なし，ACしたかどうかのみ
        const SolveDate = solvedProblem?.Date;
        const SolveDateNum = SolveDate ? Date.parse(SolveDate) : undefined;
        const FirstSolveDate = firstSolvedProblem?.Date;
        const FirstSolveDateNum = FirstSolveDate
          ? Date.parse(FirstSolveDate)
          : undefined;
        const SolveStatus =
          solvedProblem || FirstSolveDate
            ? ProblemSolveStatus.Solved
            : ProblemSolveStatus.Trying;
        return {
          ...problem,
          DateNum,
          SolveDate,
          SolveDateNum,
          FirstSolveDate,
          FirstSolveDateNum,
          SolveStatus,
          Difficulty,
          Augmented,
          Index: undefined,
        };
      }
      // assert コンテスト情報あり
      if (!firstSolvedProblem) {
        // 未 AC
        return {
          ...problem,
          Contest: extendedContest,
          DateNum,
          SolveStatus: ProblemSolveStatus.Trying,
          Difficulty,
          Augmented,
          Index: problemIndexMap.get(problem.ProblemId),
        };
      }
      // assert AC 済み
      const SolveDate = solvedProblem?.Date;
      const SolveDateNum = SolveDate ? Date.parse(SolveDate) : undefined;
      const FirstSolveDate = firstSolvedProblem.Date;
      const FirstSolveDateNum = Date.parse(FirstSolveDate);
      const SolveStatus =
        FirstSolveDateNum > extendedContest.EndDateNum
          ? ProblemSolveStatus.Solved
          : FirstSolveDateNum >= extendedContest.DateNum
          ? ProblemSolveStatus.Intime
          : ProblemSolveStatus.BeforeContest;
      return {
        ...problem,
        Contest: extendedContest,
        DateNum,
        SolveDate,
        SolveDateNum,
        FirstSolveDate,
        FirstSolveDateNum,
        SolveStatus,
        Difficulty,
        Augmented,
        Index: problemIndexMap.get(problem.ProblemId),
      };
    }
  );
  return mergedProblems;
};

export const mergedProblemsToMap = (
  mergedProblems: MergedProblem[]
): Map<ProblemId, MergedProblem> => {
  return mergedProblems.reduce(
    (map, mergedProblem) => map.set(mergedProblem.ProblemId, mergedProblem),
    new Map<ProblemId, MergedProblem>()
  );
};

export const mergeRanking = (
  mergedProblems: MergedProblem[],
  speederProblemMap: Map<ProblemNo, RankingProblem>,
  golferProblemMap: Map<ProblemNo, RankingProblem>,
  golferPureProblemMap: Map<ProblemNo, RankingProblem>
): RankingMergedProblem[] =>
  mergedProblems.map(
    (mergedProblem): RankingMergedProblem => {
      const FastestRankingProblem =
        typeof mergedProblem.No === 'number'
          ? speederProblemMap.get(mergedProblem.No)
          : undefined;
      const ShortestRankingProblem =
        typeof mergedProblem.No === 'number'
          ? golferProblemMap.get(mergedProblem.No)
          : undefined;
      const PureShortestRankingProblem =
        typeof mergedProblem.No === 'number'
          ? golferPureProblemMap.get(mergedProblem.No)
          : undefined;
      const ContestName = mergedProblem.Contest?.Name;
      const FastestRankingUserName = FastestRankingProblem?.UserName;
      const ShortestRankingUserName = ShortestRankingProblem?.UserName;
      const PureShortestRankingUserName = PureShortestRankingProblem?.UserName;
      return {
        ...mergedProblem,
        FastestRankingProblem,
        ShortestRankingProblem,
        PureShortestRankingProblem,
        ContestName,
        FastestRankingUserName,
        ShortestRankingUserName,
        PureShortestRankingUserName,
      };
    }
  );
