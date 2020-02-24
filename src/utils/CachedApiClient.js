
const BASE_URL = "https://yukicoder.me";
const STATIC_API_BASE_URL = `${BASE_URL}/api/v1`;

const fetchArray = async (url) => {
  const res = await fetch(url);
  return await res.json();
}
const fetchContests = () => fetchArray(`${STATIC_API_BASE_URL}/contest/past`);
const fetchProblems = () => fetchArray(`${STATIC_API_BASE_URL}/problems`);
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