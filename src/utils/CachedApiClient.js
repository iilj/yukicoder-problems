
const BASE_URL = "https://yukicoder.me";
const STATIC_API_BASE_URL = `${BASE_URL}/api/v1`;

const fetchArray = async (url) => {
  const res = await fetch(url);
  return await res.json();
}
const fetchContests = () => fetchArray(`${STATIC_API_BASE_URL}/contest/past`);
const fetchProblems = () => fetchArray(`${STATIC_API_BASE_URL}/problems`);
const fetchGolferRanking = () => fetchArray(`${STATIC_API_BASE_URL}/ranking/golfer`);
const fetchGolferRankingPure = () => fetchArray(`${STATIC_API_BASE_URL}/ranking/golfer/pure`);
const fetchUserInfo = (param, user) => fetchArray(`${STATIC_API_BASE_URL}/user/${param}/${encodeURIComponent(user)}`);
const fetchSolvedProblems = (param, user) => fetchArray(`${STATIC_API_BASE_URL}/solved/${param}/${encodeURIComponent(user)}`);

////////////////////
// Raw Data
////////////////////

// contests raw array
let CACHED_CONTESTS;
export const cachedContestArray = () => {
  if (CACHED_CONTESTS === undefined) {
    try {
      CACHED_CONTESTS = fetchContests();
    } catch (e) {
      console.log(e);
      CACHED_CONTESTS = [];
    }
  }
  return CACHED_CONTESTS;
};

// problems raw array
let CACHED_PROBLEMS;
export const cachedProblemArray = () => {
  if (CACHED_PROBLEMS === undefined) {
    try {
      CACHED_PROBLEMS = fetchProblems();
    } catch (e) {
      console.log(e);
      CACHED_PROBLEMS = [];
    }
  }
  return CACHED_PROBLEMS;
};

// solved problems raw array
let CACHED_SOLVED_PROBLEMS;
let CACHED_SOLVED_PROBLEMS_PARAM;
let CACHED_SOLVED_PROBLEMS_USER;
export const cachedSolvedProblemArray = (param, user) => {
  if (CACHED_SOLVED_PROBLEMS === undefined
    || param !== CACHED_SOLVED_PROBLEMS_PARAM
    || user !== CACHED_SOLVED_PROBLEMS_USER
  ) {
    CACHED_SOLVED_PROBLEMS_PARAM = param;
    CACHED_SOLVED_PROBLEMS_USER = user;
    try {
      CACHED_SOLVED_PROBLEMS = fetchSolvedProblems(param, user);
    } catch (e) {
      console.log(e);
      CACHED_SOLVED_PROBLEMS = [];
    }
  }
  return CACHED_SOLVED_PROBLEMS;
};

// user data object
let CACHED_USER_INFO;
let CACHED_USER_INFO_PARAM;
let CACHED_USER_INFO_USER;
export const cachedUserInfo = (param, user) => {
  if (CACHED_USER_INFO === undefined
    || param !== CACHED_USER_INFO_PARAM
    || user !== CACHED_USER_INFO_USER
  ) {
    CACHED_USER_INFO_PARAM = param;
    CACHED_USER_INFO_USER = user;
    try {
      CACHED_USER_INFO = fetchUserInfo(param, user);
    } catch (e) {
      console.log(e);
      CACHED_USER_INFO = {};
    }
  }
  return CACHED_USER_INFO;
};

// shortest code array
let CACHED_GOLFER_RANKING;
export const cachedGolferRankingArray = () => {
  if (CACHED_GOLFER_RANKING === undefined) {
    try {
      CACHED_GOLFER_RANKING = fetchGolferRanking();
    } catch (e) {
      console.log(e);
      CACHED_GOLFER_RANKING = [];
    }
  }
  return CACHED_GOLFER_RANKING;
};

// pure shortest code array
let CACHED_GOLFER_RANKING_PURE;
export const cachedGolferRankingPureArray = () => {
  if (CACHED_GOLFER_RANKING_PURE === undefined) {
    try {
      CACHED_GOLFER_RANKING_PURE = fetchGolferRankingPure();
    } catch (e) {
      console.log(e);
      CACHED_GOLFER_RANKING_PURE = [];
    }
  }
  return CACHED_GOLFER_RANKING_PURE;
};

////////////////////
// Map Data
////////////////////

// map (contest id -> contest object)
let CACHED_CONTESTS_MAP;
export const cachedContestMap = async () => {
  if (CACHED_CONTESTS_MAP === undefined) {
    CACHED_CONTESTS_MAP = (await cachedContestArray()).reduce((map, contest) => {
      if (contest === undefined)
        return map;
      map[contest.Id] = contest;
      return map;
    }, {});
  }
  return CACHED_CONTESTS_MAP;
};

// map (problem id -> problem object)
let CACHED_PROBLEMS_MAP;
export const cachedProblemMap = async () => {
  if (CACHED_PROBLEMS_MAP === undefined) {
    CACHED_PROBLEMS_MAP = (await cachedProblemArray()).reduce((map, problem) => {
      if (problem === undefined)
        return map;
      map[problem.ProblemId] = problem;
      return map;
    }, {});
  }
  return CACHED_PROBLEMS_MAP;
};

// map (problem id -> contest id)
let CACHED_PROBLEM_CONTEST_MAP;
export const cachedProblemContestMap = async () => {
  if (CACHED_PROBLEM_CONTEST_MAP === undefined) {
    CACHED_PROBLEM_CONTEST_MAP = (await cachedContestArray()).reduce((map, contest) => {
      if (contest === undefined || contest.ProblemIdList === undefined)
        return map;
      // map[contest.Id] = contest;
      contest.ProblemIdList.forEach(problemId => {
        map[problemId] = contest.Id;
      });
      return map;
    }, {});
  }
  return CACHED_PROBLEM_CONTEST_MAP;
};

// map (problem id -> solved problem object)
let CACHED_SOLVED_PROBLEMS_MAP;
export const cachedSolvedProblemMap = async (param, user) => {
  if (CACHED_SOLVED_PROBLEMS_MAP === undefined
    || param !== CACHED_SOLVED_PROBLEMS_PARAM
    || user !== CACHED_SOLVED_PROBLEMS_USER
  ) {
    const cachedSolvedProblems = await cachedSolvedProblemArray(param, user);
    if (cachedSolvedProblems && Array.isArray(cachedSolvedProblems)) {
      CACHED_SOLVED_PROBLEMS_MAP = cachedSolvedProblems.reduce((map, problem) => {
        if (problem === undefined)
          return map;
        map[problem.ProblemId] = problem;
        return map;
      }, {});
    } else {
      CACHED_SOLVED_PROBLEMS_MAP = {};
    }
  }
  return CACHED_SOLVED_PROBLEMS_MAP;
};

// map (UserName -> RankingProblem array)
let CACHED_GOLFER_RANKING_MAP;
export const cachedGolferMap = async () => {
  if (CACHED_GOLFER_RANKING_MAP === undefined) {
    CACHED_GOLFER_RANKING_MAP = (await cachedGolferRankingArray()).reduce((map, rankingProblem) => {
      if (!(rankingProblem.UserName in map)) {
        map[rankingProblem.UserName] = [];
      }
      map[rankingProblem.UserName].push(rankingProblem);
      return map;
    }, {});
  }
  return CACHED_GOLFER_RANKING_MAP;
};

// map (UserName -> RankingProblem array of pure shortest code)
let CACHED_GOLFER_RANKING_PURE_MAP;
export const cachedGolferPureMap = async () => {
  if (CACHED_GOLFER_RANKING_PURE_MAP === undefined) {
    CACHED_GOLFER_RANKING_PURE_MAP = (await cachedGolferRankingPureArray()).reduce((map, rankingProblem) => {
      if (!(rankingProblem.UserName in map)) {
        map[rankingProblem.UserName] = [];
      }
      map[rankingProblem.UserName].push(rankingProblem);
      return map;
    }, {});
  }
  return CACHED_GOLFER_RANKING_PURE_MAP;
};

// map (Problem No -> RankingProblem of golfers)
let CACHED_GOLFER_RANKING_PROBLEM_MAP;
export const cachedGolferRankingProblemMap = async () => {
  if (CACHED_GOLFER_RANKING_PROBLEM_MAP === undefined) {
    CACHED_GOLFER_RANKING_PROBLEM_MAP = (await cachedGolferRankingArray()).reduce((map, rankingProblem) => {
      map[rankingProblem.No] = rankingProblem;
      return map;
    }, {});
  }
  return CACHED_GOLFER_RANKING_PROBLEM_MAP;
};

// map (Problem No -> RankingProblem of pure golfers)
let CACHED_GOLFER_RANKING_PURE_PROBLEM_MAP;
export const cachedGolferRankingPureProblemMap = async () => {
  if (CACHED_GOLFER_RANKING_PURE_PROBLEM_MAP === undefined) {
    CACHED_GOLFER_RANKING_PURE_PROBLEM_MAP = (await cachedGolferRankingPureArray()).reduce((map, rankingProblem) => {
      map[rankingProblem.No] = rankingProblem;
      return map;
    }, {});
  }
  return CACHED_GOLFER_RANKING_PURE_PROBLEM_MAP;
};
