import { Difficulties, DifficultyDetailData } from '../interfaces/Difficulty';
import { ProblemId } from '../interfaces/Problem';

const BASE_URL = 'https://iilj.github.io/yukicoder-leaderboard-crawler/json';

const fetchJson = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  const obj = (await res.json()) as T | { Message: string };
  return obj as T;
};

const fetchDifficulties = () =>
  fetchJson<Difficulties>(`${BASE_URL}/summary_v2.json`);

const fetchDifficultyDetailData = (problemId: ProblemId) =>
  fetchJson<DifficultyDetailData>(`${BASE_URL}/detail/${problemId}.json`);

// contests raw array
let CACHED_DIFFICULTIES: Difficulties;
export const cachedDifficultyData = async (): Promise<Difficulties> => {
  if (CACHED_DIFFICULTIES === undefined) {
    try {
      CACHED_DIFFICULTIES = await fetchDifficulties();
    } catch (e) {
      console.log(e);
      CACHED_DIFFICULTIES = {} as Difficulties;
    }
  }
  return CACHED_DIFFICULTIES;
};

export const difficultyDetailDataUnit = {
  difficulty: -1,
  coef: -1,
  bias: -1,
  augmented: false,
  detail: [],
} as DifficultyDetailData;
export const cachedDifficultyDetailData = async (
  problemId: ProblemId
): Promise<DifficultyDetailData> => {
  if (CACHED_DIFFICULTIES === undefined) {
    try {
      CACHED_DIFFICULTIES = await fetchDifficulties();
    } catch (e) {
      console.log(e);
      CACHED_DIFFICULTIES = {} as Difficulties;
    }
  }
  if (problemId in CACHED_DIFFICULTIES) {
    return await fetchDifficultyDetailData(problemId);
  }
  return difficultyDetailDataUnit;
};
