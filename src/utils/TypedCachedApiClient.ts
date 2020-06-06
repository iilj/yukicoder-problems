import { Problem, ProblemNo, ProblemId } from '../interfaces/Problem'
import { Contest, ContestId } from '../interfaces/Contest'
import { Language, LangId } from "../interfaces/Language";
import { RankingProblem } from "../interfaces/RankingProblem";
import { User, UserName } from "../interfaces/User";

const BASE_URL = 'https://yukicoder.me';
const STATIC_API_BASE_URL = `${BASE_URL}/api/v1`;

const assertResultIsValid = (obj: any): void => {
  if ('Message' in obj) throw new Error(obj.Message);
};
const fetchJson = async <T>(
  url: string
): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  const obj: any = await res.json();
  assertResultIsValid(obj);
  return obj as T;
};

export type UserParam = 'id' | 'name' | 'twitter';

const fetchContests = () => fetchJson<Contest[]>(`${STATIC_API_BASE_URL}/contest/past`);
const fetchProblems = () => fetchJson<Problem[]>(`${STATIC_API_BASE_URL}/problems`);
const fetchLanguages = () => fetchJson<Language[]>(`${STATIC_API_BASE_URL}/languages`);
const fetchGolferRanking = () => fetchJson<RankingProblem[]>(`${STATIC_API_BASE_URL}/ranking/golfer`);
const fetchGolferRankingPure = () => fetchJson<RankingProblem[]>(`${STATIC_API_BASE_URL}/ranking/golfer/pure`);
const fetchGolferRankingPureLangId = (landId: LangId) => fetchJson<RankingProblem[]>(`${STATIC_API_BASE_URL}/ranking/golfer/pure/${landId}`);
const fetchUserInfo = (param: UserParam, user: UserName) => fetchJson<User>(`${STATIC_API_BASE_URL}/user/${param}/${encodeURIComponent(user)}`);
const fetchSolvedProblems = (param: UserParam, user: UserName) => fetchJson<Problem[]>(`${STATIC_API_BASE_URL}/solved/${param}/${encodeURIComponent(user)}`);

// //////////////////
// Raw Data
// //////////////////

// contests raw array
let CACHED_CONTESTS: Contest[];
export const cachedContestArray = async (): Promise<Contest[]> => {
  if (CACHED_CONTESTS === undefined) {
    try {
      CACHED_CONTESTS = await fetchContests();
    } catch (e) {
      console.log(e);
      CACHED_CONTESTS = [];
    }
  }
  return CACHED_CONTESTS;
};

// problems raw array
let CACHED_PROBLEMS: Problem[];
export const cachedProblemArray = async (): Promise<Problem[]> => {
  if (CACHED_PROBLEMS === undefined) {
    try {
      CACHED_PROBLEMS = await fetchProblems();
    } catch (e) {
      console.log(e);
      CACHED_PROBLEMS = [];
    }
  }
  return CACHED_PROBLEMS;
};

// solved problems raw array
let CACHED_SOLVED_PROBLEMS: Problem[];
let CACHED_SOLVED_PROBLEMS_PARAM: UserParam;
let CACHED_SOLVED_PROBLEMS_USER: string;
export const cachedSolvedProblemArray = async (param: UserParam, user: string): Promise<Problem[]> => {
  if (
    CACHED_SOLVED_PROBLEMS === undefined
    || param !== CACHED_SOLVED_PROBLEMS_PARAM
    || user !== CACHED_SOLVED_PROBLEMS_USER
  ) {
    try {
      CACHED_SOLVED_PROBLEMS = await fetchSolvedProblems(param, user);
    } catch (e) {
      console.log(e);
      CACHED_SOLVED_PROBLEMS = [];
    }
    CACHED_SOLVED_PROBLEMS_PARAM = param;
    CACHED_SOLVED_PROBLEMS_USER = user;
  }
  return CACHED_SOLVED_PROBLEMS;
};

// user data object
let CACHED_USER_INFO: User;
let CACHED_USER_INFO_PARAM: UserParam;
let CACHED_USER_INFO_USER: string;
export const cachedUserInfo = async (param: UserParam, user: string): Promise<User> => {
  if (
    CACHED_USER_INFO === undefined
    || param !== CACHED_USER_INFO_PARAM
    || user !== CACHED_USER_INFO_USER
  ) {
    try {
      CACHED_USER_INFO = await fetchUserInfo(param, user);
    } catch (e) {
      console.log(e);
      CACHED_USER_INFO = {} as User;
    }
    CACHED_USER_INFO_PARAM = param;
    CACHED_USER_INFO_USER = user;
  }
  return CACHED_USER_INFO;
};

// shortest code array
let CACHED_GOLFER_RANKING: RankingProblem[];
export const cachedGolferRankingArray = async (): Promise<RankingProblem[]> => {
  if (CACHED_GOLFER_RANKING === undefined) {
    try {
      CACHED_GOLFER_RANKING = await fetchGolferRanking();
    } catch (e) {
      console.log(e);
      CACHED_GOLFER_RANKING = [];
    }
  }
  return CACHED_GOLFER_RANKING;
};

// pure shortest code array
let CACHED_GOLFER_RANKING_PURE: RankingProblem[];
export const cachedGolferRankingPureArray = async (): Promise<RankingProblem[]> => {
  if (CACHED_GOLFER_RANKING_PURE === undefined) {
    try {
      CACHED_GOLFER_RANKING_PURE = await fetchGolferRankingPure();
    } catch (e) {
      console.log(e);
      CACHED_GOLFER_RANKING_PURE = [];
    }
  }
  return CACHED_GOLFER_RANKING_PURE;
};

// pure shortest code array map (langid -> array of shortest submissions)
const CACHED_GOLFER_RANKING_PURE_LANG_MAP = new Map<LangId, RankingProblem[]>();
export const cachedGolferRankingPureLangIdArray = async (langId: LangId): Promise<RankingProblem[]> => {
  if (!CACHED_GOLFER_RANKING_PURE_LANG_MAP.has(langId)) {
    try {
      CACHED_GOLFER_RANKING_PURE_LANG_MAP.set(langId, await fetchGolferRankingPureLangId(langId));
    } catch (e) {
      console.log(e);
      CACHED_GOLFER_RANKING_PURE_LANG_MAP.set(langId, []);
    }
  }
  return CACHED_GOLFER_RANKING_PURE_LANG_MAP.get(langId) as RankingProblem[];
};

// language array
let CACHED_LANGUAGES: Language[];
export const cachedLanguageArray = async (): Promise<Language[]> => {
  if (CACHED_LANGUAGES === undefined) {
    try {
      CACHED_LANGUAGES = await fetchLanguages();
    } catch (e) {
      console.log(e);
      CACHED_LANGUAGES = [];
    }
  }
  return CACHED_LANGUAGES;
};

// //////////////////
// Map Data
// //////////////////

// map (contest id -> contest object)
let CACHED_CONTESTS_MAP: Map<ContestId, Contest>;
export const cachedContestMap = async (): Promise<Map<ContestId, Contest>> => {
  if (CACHED_CONTESTS_MAP === undefined) {
    CACHED_CONTESTS_MAP = (await cachedContestArray()).reduce((map, contest) => {
      if (contest === undefined) return map;
      return map.set(contest.Id, contest);
    }, new Map<ContestId, Contest>());
  }
  return CACHED_CONTESTS_MAP;
};

// map (problem id -> problem object)
let CACHED_PROBLEMS_MAP: Map<ProblemId, Problem>;
export const cachedProblemMap = async (): Promise<Map<ProblemId, Problem>> => {
  if (CACHED_PROBLEMS_MAP === undefined) {
    CACHED_PROBLEMS_MAP = (await cachedProblemArray()).reduce((map, problem) => {
      if (problem === undefined) return map;
      return map.set(problem.ProblemId, problem);
    }, new Map<ProblemId, Problem>());
  }
  return CACHED_PROBLEMS_MAP;
};

// map (problem id -> contest id)
let CACHED_PROBLEM_CONTEST_MAP: Map<ProblemId, ContestId>;
export const cachedProblemContestMap = async (): Promise<Map<ProblemId, ContestId>> => {
  if (CACHED_PROBLEM_CONTEST_MAP === undefined) {
    CACHED_PROBLEM_CONTEST_MAP = (await cachedContestArray()).reduce((map, contest) => {
      if (contest === undefined || contest.ProblemIdList === undefined) return map;
      // map[contest.Id] = contest;
      contest.ProblemIdList.forEach((problemId) => {
        map.set(problemId, contest.Id);
      });
      return map;
    }, new Map<ProblemId, ContestId>());
  }
  return CACHED_PROBLEM_CONTEST_MAP;
};

// map (problem id -> solved problem object)
let CACHED_SOLVED_PROBLEMS_MAP: Map<ProblemId, Problem>;
let CACHED_SOLVED_PROBLEMS_MAP_PARAM: UserParam;
let CACHED_SOLVED_PROBLEMS_MAP_USER: string;
export const cachedSolvedProblemMap = async (param: UserParam, user: string): Promise<Map<ProblemId, Problem>> => {
  if (
    CACHED_SOLVED_PROBLEMS_MAP === undefined
    || param !== CACHED_SOLVED_PROBLEMS_MAP_PARAM
    || user !== CACHED_SOLVED_PROBLEMS_MAP_USER
  ) {
    const cachedSolvedProblems = await cachedSolvedProblemArray(param, user);
    if (cachedSolvedProblems && Array.isArray(cachedSolvedProblems)) {
      CACHED_SOLVED_PROBLEMS_MAP = cachedSolvedProblems.reduce((map, problem) => {
        if (problem === undefined) return map;
        return map.set(problem.ProblemId, problem);
      }, new Map<ProblemId, Problem>());
    } else {
      CACHED_SOLVED_PROBLEMS_MAP = new Map<ProblemId, Problem>();
    }
    CACHED_SOLVED_PROBLEMS_MAP_PARAM = param;
    CACHED_SOLVED_PROBLEMS_MAP_USER = user;
  }
  return CACHED_SOLVED_PROBLEMS_MAP;
};

// map (UserName -> RankingProblem array)
let CACHED_GOLFER_RANKING_MAP: Map<UserName, RankingProblem[]>;
export const cachedGolferMap = async (): Promise<Map<UserName, RankingProblem[]>> => {
  if (CACHED_GOLFER_RANKING_MAP === undefined) {
    CACHED_GOLFER_RANKING_MAP = (await cachedGolferRankingArray()).reduce((map, rankingProblem) => {
      if (!map.has(rankingProblem.UserName)) {
        map.set(rankingProblem.UserName, []);
      }
      (map.get(rankingProblem.UserName) as RankingProblem[]).push(rankingProblem);
      return map;
    }, new Map<UserName, RankingProblem[]>());
  }
  return CACHED_GOLFER_RANKING_MAP;
};

// map (UserName -> RankingProblem array of pure shortest code)
let CACHED_GOLFER_RANKING_PURE_MAP: Map<UserName, RankingProblem[]>;
export const cachedGolferPureMap = async (): Promise<Map<UserName, RankingProblem[]>> => {
  if (CACHED_GOLFER_RANKING_PURE_MAP === undefined) {
    CACHED_GOLFER_RANKING_PURE_MAP = (await cachedGolferRankingPureArray()).reduce(
      (map, rankingProblem) => {
        if (!map.has(rankingProblem.UserName)) {
          map.set(rankingProblem.UserName, []);
        }
        (map.get(rankingProblem.UserName) as RankingProblem[]).push(rankingProblem);
        return map;
      }, new Map<UserName, RankingProblem[]>()
    );
  }
  return CACHED_GOLFER_RANKING_PURE_MAP;
};

// map (langId -> UserName -> RankingProblem array of pure shortest code)
const CACHED_GOLFER_RANKING_PURE_MAP_LANG_MAP = new Map<LangId, Map<UserName, RankingProblem[]>>();
export const cachedGolferPureMapLangMap = async (langId: LangId): Promise<Map<UserName, RankingProblem[]>> => {
  if (!CACHED_GOLFER_RANKING_PURE_MAP_LANG_MAP.has(langId)) {
    CACHED_GOLFER_RANKING_PURE_MAP_LANG_MAP.set(langId, (
      await cachedGolferRankingPureLangIdArray(langId)
    ).reduce((map, rankingProblem) => {
      if (!map.has(rankingProblem.UserName)) {
        map.set(rankingProblem.UserName, []);
      }
      (map.get(rankingProblem.UserName) as RankingProblem[]).push(rankingProblem);
      return map;
    }, new Map<UserName, RankingProblem[]>()));
  }
  return CACHED_GOLFER_RANKING_PURE_MAP_LANG_MAP.get(langId) as Map<UserName, RankingProblem[]>;
};

// map (Problem No -> RankingProblem of golfers)
let CACHED_GOLFER_RANKING_PROBLEM_MAP: Map<ProblemNo, RankingProblem>;
export const cachedGolferRankingProblemMap = async (): Promise<Map<ProblemNo, RankingProblem>> => {
  if (CACHED_GOLFER_RANKING_PROBLEM_MAP === undefined) {
    CACHED_GOLFER_RANKING_PROBLEM_MAP = (await cachedGolferRankingArray()).reduce(
      (map, rankingProblem) => map.set(rankingProblem.No, rankingProblem),
      new Map<ProblemNo, RankingProblem>(),
    );
  }
  return CACHED_GOLFER_RANKING_PROBLEM_MAP;
};

// map (Problem No -> RankingProblem of pure golfers)
let CACHED_GOLFER_RANKING_PURE_PROBLEM_MAP: Map<ProblemNo, RankingProblem>;
export const cachedGolferRankingPureProblemMap = async (): Promise<Map<ProblemNo, RankingProblem>> => {
  if (CACHED_GOLFER_RANKING_PURE_PROBLEM_MAP === undefined) {
    CACHED_GOLFER_RANKING_PURE_PROBLEM_MAP = (await cachedGolferRankingPureArray()).reduce(
      (map, rankingProblem) => map.set(rankingProblem.No, rankingProblem),
      new Map<ProblemNo, RankingProblem>(),
    );
  }
  return CACHED_GOLFER_RANKING_PURE_PROBLEM_MAP;
};
