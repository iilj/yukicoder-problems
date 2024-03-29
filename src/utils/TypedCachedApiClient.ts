import { Problem, ProblemNo, ProblemId } from '../interfaces/Problem';
import { SolvedProblem, FirstSolvedProblem } from '../interfaces/SolvedProblem';
import { Contest, ContestId } from '../interfaces/Contest';
import { Language, LangId } from '../interfaces/Language';
import { RankingProblem } from '../interfaces/RankingProblem';
import { User, UserName } from '../interfaces/User';
import { OpenContests } from './OpenContest';

const BASE_URL = 'https://yukicoder.me';
const STATIC_API_BASE_URL_V1 = `${BASE_URL}/api/v1`;
const STATIC_API_BASE_URL_V2 = `${BASE_URL}/api/v2`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const assertResultIsValid = (obj: any): void => {
  if ('Message' in obj) throw new Error((obj as { Message: string }).Message);
};
const fetchJson = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  const obj = (await res.json()) as T | { Message: string };
  assertResultIsValid(obj);
  return obj as T;
};

export type UserParam = 'id' | 'name' | 'twitter';

const fetchContests = () =>
  fetchJson<Contest[]>(`${STATIC_API_BASE_URL_V1}/contest/past`);
const fetchCurrentContests = () =>
  fetchJson<Contest[]>(`${STATIC_API_BASE_URL_V1}/contest/current`);
const fetchProblems = () =>
  fetchJson<Problem[]>(`${STATIC_API_BASE_URL_V1}/problems`);
const fetchLanguages = () =>
  fetchJson<Language[]>(`${STATIC_API_BASE_URL_V1}/languages`);
const fetchGolferRanking = () =>
  fetchJson<RankingProblem[]>(`${STATIC_API_BASE_URL_V2}/ranking/golfer`);
const fetchGolferRankingPure = () =>
  fetchJson<RankingProblem[]>(`${STATIC_API_BASE_URL_V2}/ranking/golfer/pure`);
const fetchSpeederRanking = () =>
  fetchJson<RankingProblem[]>(`${STATIC_API_BASE_URL_V2}/ranking/speeder`);
const fetchGolferRankingPureLangId = (landId: LangId) =>
  fetchJson<RankingProblem[]>(
    `${STATIC_API_BASE_URL_V2}/ranking/golfer/pure/${landId}`
  );
const fetchUserInfo = (param: UserParam, user: UserName) =>
  fetchJson<User>(
    `${STATIC_API_BASE_URL_V1}/user/${param}/${encodeURIComponent(user)}`
  );
const fetchSolvedProblems = (param: UserParam, user: UserName) =>
  fetchJson<SolvedProblem[]>(
    `${STATIC_API_BASE_URL_V1}/solved/${param}/${encodeURIComponent(user)}`
  ).then((solvedProblems) =>
    solvedProblems.map((solvedProblem) => {
      solvedProblem.First = false;
      return solvedProblem;
    })
  );
const fetchFirstSolvedProblems = (param: UserParam, user: UserName) =>
  fetchJson<FirstSolvedProblem[]>(
    `${STATIC_API_BASE_URL_V1}/solved/${param}/${encodeURIComponent(
      user
    )}/first`
  ).then((solvedProblems) =>
    solvedProblems.map((solvedProblem) => {
      solvedProblem.First = true;
      return solvedProblem;
    })
  );
const fetchSingleProblem = (problemId: ProblemId) =>
  fetchJson<Problem>(`${STATIC_API_BASE_URL_V1}/problems/${problemId}`);

// //////////////////
// Raw Data
// //////////////////

// contests raw array
let CACHED_CONTESTS: Contest[];
export const cachedContestArray = async (): Promise<Contest[]> => {
  if (CACHED_CONTESTS === undefined) {
    try {
      CACHED_CONTESTS = (await fetchCurrentContests())
        .concat(await fetchContests())
        .concat(OpenContests);
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
let CACHED_SOLVED_PROBLEMS: SolvedProblem[];
let CACHED_SOLVED_PROBLEMS_PARAM: UserParam;
let CACHED_SOLVED_PROBLEMS_USER: string;
export const cachedSolvedProblemArray = async (
  param: UserParam,
  user: string
): Promise<SolvedProblem[]> => {
  if (
    CACHED_SOLVED_PROBLEMS === undefined ||
    param !== CACHED_SOLVED_PROBLEMS_PARAM ||
    user !== CACHED_SOLVED_PROBLEMS_USER
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

// first solved problems raw array
let CACHED_FIRST_SOLVED_PROBLEMS: FirstSolvedProblem[];
let CACHED_FIRST_SOLVED_PROBLEMS_PARAM: UserParam;
let CACHED_FIRST_SOLVED_PROBLEMS_USER: string;
export const cachedFirstSolvedProblemArray = async (
  param: UserParam,
  user: string
): Promise<FirstSolvedProblem[]> => {
  if (
    CACHED_FIRST_SOLVED_PROBLEMS === undefined ||
    param !== CACHED_FIRST_SOLVED_PROBLEMS_PARAM ||
    user !== CACHED_FIRST_SOLVED_PROBLEMS_USER
  ) {
    try {
      CACHED_FIRST_SOLVED_PROBLEMS = await fetchFirstSolvedProblems(
        param,
        user
      );
    } catch (e) {
      console.log(e);
      CACHED_FIRST_SOLVED_PROBLEMS = [];
    }
    CACHED_FIRST_SOLVED_PROBLEMS_PARAM = param;
    CACHED_FIRST_SOLVED_PROBLEMS_USER = user;
  }
  return CACHED_FIRST_SOLVED_PROBLEMS;
};

const CACHED_SINGLE_PROBLEM_MAP = new Map<ProblemId, Problem>();
export const cachedSingleProblem = async (
  problemId: ProblemId
): Promise<Problem> => {
  if (!CACHED_SINGLE_PROBLEM_MAP.has(problemId)) {
    try {
      CACHED_SINGLE_PROBLEM_MAP.set(
        problemId,
        await fetchSingleProblem(problemId)
      );
    } catch (e) {
      console.log(e);
      CACHED_SINGLE_PROBLEM_MAP.set(problemId, {} as Problem);
    }
  }
  return CACHED_SINGLE_PROBLEM_MAP.get(problemId) as Problem;
};

// user data object
let CACHED_USER_INFO: User;
let CACHED_USER_INFO_PARAM: UserParam;
let CACHED_USER_INFO_USER: string;
export const cachedUserInfo = async (
  param: UserParam,
  user: string
): Promise<User> => {
  if (
    CACHED_USER_INFO === undefined ||
    param !== CACHED_USER_INFO_PARAM ||
    user !== CACHED_USER_INFO_USER
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
export const cachedGolferRankingPureArray = async (): Promise<
  RankingProblem[]
> => {
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
export const cachedGolferRankingPureLangIdArray = async (
  langId: LangId
): Promise<RankingProblem[]> => {
  if (!CACHED_GOLFER_RANKING_PURE_LANG_MAP.has(langId)) {
    try {
      CACHED_GOLFER_RANKING_PURE_LANG_MAP.set(
        langId,
        await fetchGolferRankingPureLangId(langId)
      );
    } catch (e) {
      console.log(e);
      CACHED_GOLFER_RANKING_PURE_LANG_MAP.set(langId, []);
    }
  }
  return CACHED_GOLFER_RANKING_PURE_LANG_MAP.get(langId) as RankingProblem[];
};

// shortest code array
let CACHED_SPEEDER_RANKING: RankingProblem[];
export const cachedSpeederRankingArray = async (): Promise<
  RankingProblem[]
> => {
  if (CACHED_SPEEDER_RANKING === undefined) {
    try {
      CACHED_SPEEDER_RANKING = await fetchSpeederRanking();
    } catch (e) {
      console.log(e);
      CACHED_SPEEDER_RANKING = [];
    }
  }
  return CACHED_SPEEDER_RANKING;
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
    CACHED_CONTESTS_MAP = (await cachedContestArray()).reduce(
      (map, contest) => {
        if (contest === undefined) return map;
        return map.set(contest.Id, contest);
      },
      new Map<ContestId, Contest>()
    );
  }
  return CACHED_CONTESTS_MAP;
};

// map (problem id -> problem object)
let CACHED_PROBLEMS_MAP: Map<ProblemId, Problem>;
export const cachedProblemMap = async (): Promise<Map<ProblemId, Problem>> => {
  if (CACHED_PROBLEMS_MAP === undefined) {
    CACHED_PROBLEMS_MAP = (await cachedProblemArray()).reduce(
      (map, problem) => {
        if (problem === undefined) return map;
        return map.set(problem.ProblemId, problem);
      },
      new Map<ProblemId, Problem>()
    );
  }
  return CACHED_PROBLEMS_MAP;
};

// map (problem id -> contest id)
let CACHED_PROBLEM_CONTEST_MAP: Map<ProblemId, ContestId>;
export const cachedProblemContestMap = async (): Promise<
  Map<ProblemId, ContestId>
> => {
  if (CACHED_PROBLEM_CONTEST_MAP === undefined) {
    CACHED_PROBLEM_CONTEST_MAP = (await cachedContestArray()).reduce(
      (map, contest) => {
        if (contest === undefined || contest.ProblemIdList === undefined)
          return map;
        // map[contest.Id] = contest;
        contest.ProblemIdList.forEach((problemId) => {
          map.set(problemId, contest.Id);
        });
        return map;
      },
      new Map<ProblemId, ContestId>()
    );
  }
  return CACHED_PROBLEM_CONTEST_MAP;
};

// map (problem id -> solved problem object)
let CACHED_SOLVED_PROBLEMS_MAP: Map<ProblemId, SolvedProblem>;
let CACHED_SOLVED_PROBLEMS_MAP_PARAM: UserParam;
let CACHED_SOLVED_PROBLEMS_MAP_USER: string;
export const cachedSolvedProblemMap = async (
  param: UserParam,
  user: string
): Promise<Map<ProblemId, SolvedProblem>> => {
  if (
    CACHED_SOLVED_PROBLEMS_MAP === undefined ||
    param !== CACHED_SOLVED_PROBLEMS_MAP_PARAM ||
    user !== CACHED_SOLVED_PROBLEMS_MAP_USER
  ) {
    const cachedSolvedProblems = await cachedSolvedProblemArray(param, user);
    if (cachedSolvedProblems && Array.isArray(cachedSolvedProblems)) {
      CACHED_SOLVED_PROBLEMS_MAP = cachedSolvedProblems.reduce(
        (map, problem) => {
          if (problem === undefined) return map;
          return map.set(problem.ProblemId, problem);
        },
        new Map<ProblemId, SolvedProblem>()
      );
    } else {
      CACHED_SOLVED_PROBLEMS_MAP = new Map<ProblemId, SolvedProblem>();
    }
    CACHED_SOLVED_PROBLEMS_MAP_PARAM = param;
    CACHED_SOLVED_PROBLEMS_MAP_USER = user;
  }
  return CACHED_SOLVED_PROBLEMS_MAP;
};

// map (problem id -> first solved problem object)
let CACHED_FIRST_SOLVED_PROBLEMS_MAP: Map<ProblemId, FirstSolvedProblem>;
let CACHED_FIRST_SOLVED_PROBLEMS_MAP_PARAM: UserParam;
let CACHED_FIRST_SOLVED_PROBLEMS_MAP_USER: string;
export const cachedFirstSolvedProblemMap = async (
  param: UserParam,
  user: string
): Promise<Map<ProblemId, FirstSolvedProblem>> => {
  if (
    CACHED_FIRST_SOLVED_PROBLEMS_MAP === undefined ||
    param !== CACHED_FIRST_SOLVED_PROBLEMS_MAP_PARAM ||
    user !== CACHED_FIRST_SOLVED_PROBLEMS_MAP_USER
  ) {
    const cachedFirstSolvedProblems = await cachedFirstSolvedProblemArray(
      param,
      user
    );
    if (cachedFirstSolvedProblems && Array.isArray(cachedFirstSolvedProblems)) {
      CACHED_FIRST_SOLVED_PROBLEMS_MAP = cachedFirstSolvedProblems.reduce(
        (map, problem) => {
          if (problem === undefined) return map;
          return map.set(problem.ProblemId, problem);
        },
        new Map<ProblemId, FirstSolvedProblem>()
      );
    } else {
      CACHED_FIRST_SOLVED_PROBLEMS_MAP = new Map<
        ProblemId,
        FirstSolvedProblem
      >();
    }
    CACHED_FIRST_SOLVED_PROBLEMS_MAP_PARAM = param;
    CACHED_FIRST_SOLVED_PROBLEMS_MAP_USER = user;
  }
  return CACHED_FIRST_SOLVED_PROBLEMS_MAP;
};

// map (UserName -> RankingProblem array)
let CACHED_GOLFER_RANKING_MAP: Map<UserName, RankingProblem[]>;
export const cachedGolferMap = async (): Promise<
  Map<UserName, RankingProblem[]>
> => {
  if (CACHED_GOLFER_RANKING_MAP === undefined) {
    CACHED_GOLFER_RANKING_MAP = (await cachedGolferRankingArray()).reduce(
      (map, rankingProblem) => {
        if (!map.has(rankingProblem.UserName)) {
          map.set(rankingProblem.UserName, []);
        }
        (map.get(rankingProblem.UserName) as RankingProblem[]).push(
          rankingProblem
        );
        return map;
      },
      new Map<UserName, RankingProblem[]>()
    );
  }
  return CACHED_GOLFER_RANKING_MAP;
};

// map (UserName -> RankingProblem array of pure shortest code)
let CACHED_GOLFER_RANKING_PURE_MAP: Map<UserName, RankingProblem[]>;
export const cachedGolferPureMap = async (): Promise<
  Map<UserName, RankingProblem[]>
> => {
  if (CACHED_GOLFER_RANKING_PURE_MAP === undefined) {
    CACHED_GOLFER_RANKING_PURE_MAP = (
      await cachedGolferRankingPureArray()
    ).reduce((map, rankingProblem) => {
      if (!map.has(rankingProblem.UserName)) {
        map.set(rankingProblem.UserName, []);
      }
      (map.get(rankingProblem.UserName) as RankingProblem[]).push(
        rankingProblem
      );
      return map;
    }, new Map<UserName, RankingProblem[]>());
  }
  return CACHED_GOLFER_RANKING_PURE_MAP;
};

// map (langId -> UserName -> RankingProblem array of pure shortest code)
const CACHED_GOLFER_RANKING_PURE_MAP_LANG_MAP = new Map<
  LangId,
  Map<UserName, RankingProblem[]>
>();
export const cachedGolferPureMapLangMap = async (
  langId: LangId
): Promise<Map<UserName, RankingProblem[]>> => {
  if (!CACHED_GOLFER_RANKING_PURE_MAP_LANG_MAP.has(langId)) {
    CACHED_GOLFER_RANKING_PURE_MAP_LANG_MAP.set(
      langId,
      (await cachedGolferRankingPureLangIdArray(langId)).reduce(
        (map, rankingProblem) => {
          if (!map.has(rankingProblem.UserName)) {
            map.set(rankingProblem.UserName, []);
          }
          (map.get(rankingProblem.UserName) as RankingProblem[]).push(
            rankingProblem
          );
          return map;
        },
        new Map<UserName, RankingProblem[]>()
      )
    );
  }
  return CACHED_GOLFER_RANKING_PURE_MAP_LANG_MAP.get(langId) as Map<
    UserName,
    RankingProblem[]
  >;
};

// map (UserName -> RankingProblem array)
let CACHED_SPEEDER_RANKING_MAP: Map<UserName, RankingProblem[]>;
export const cachedSpeederMap = async (): Promise<
  Map<UserName, RankingProblem[]>
> => {
  if (CACHED_SPEEDER_RANKING_MAP === undefined) {
    CACHED_SPEEDER_RANKING_MAP = (await cachedSpeederRankingArray()).reduce(
      (map, rankingProblem) => {
        if (!map.has(rankingProblem.UserName)) {
          map.set(rankingProblem.UserName, []);
        }
        (map.get(rankingProblem.UserName) as RankingProblem[]).push(
          rankingProblem
        );
        return map;
      },
      new Map<UserName, RankingProblem[]>()
    );
  }
  return CACHED_SPEEDER_RANKING_MAP;
};

// map (Problem No -> RankingProblem of golfers)
let CACHED_GOLFER_RANKING_PROBLEM_MAP: Map<ProblemNo, RankingProblem>;
export const cachedGolferRankingProblemMap = async (): Promise<
  Map<ProblemNo, RankingProblem>
> => {
  if (CACHED_GOLFER_RANKING_PROBLEM_MAP === undefined) {
    CACHED_GOLFER_RANKING_PROBLEM_MAP = (
      await cachedGolferRankingArray()
    ).reduce(
      (map, rankingProblem) => map.set(rankingProblem.No, rankingProblem),
      new Map<ProblemNo, RankingProblem>()
    );
  }
  return CACHED_GOLFER_RANKING_PROBLEM_MAP;
};

// map (Problem No -> RankingProblem of pure golfers)
let CACHED_GOLFER_RANKING_PURE_PROBLEM_MAP: Map<ProblemNo, RankingProblem>;
export const cachedGolferRankingPureProblemMap = async (): Promise<
  Map<ProblemNo, RankingProblem>
> => {
  if (CACHED_GOLFER_RANKING_PURE_PROBLEM_MAP === undefined) {
    CACHED_GOLFER_RANKING_PURE_PROBLEM_MAP = (
      await cachedGolferRankingPureArray()
    ).reduce(
      (map, rankingProblem) => map.set(rankingProblem.No, rankingProblem),
      new Map<ProblemNo, RankingProblem>()
    );
  }
  return CACHED_GOLFER_RANKING_PURE_PROBLEM_MAP;
};

// map (Problem No -> RankingProblem of speeders)
let CACHED_SPEEDER_RANKING_PROBLEM_MAP: Map<ProblemNo, RankingProblem>;
export const cachedSpeederRankingProblemMap = async (): Promise<
  Map<ProblemNo, RankingProblem>
> => {
  if (CACHED_SPEEDER_RANKING_PROBLEM_MAP === undefined) {
    CACHED_SPEEDER_RANKING_PROBLEM_MAP = (
      await cachedSpeederRankingArray()
    ).reduce(
      (map, rankingProblem) => map.set(rankingProblem.No, rankingProblem),
      new Map<ProblemNo, RankingProblem>()
    );
  }
  return CACHED_SPEEDER_RANKING_PROBLEM_MAP;
};
