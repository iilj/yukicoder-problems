import { Difficulties } from '../interfaces/MergedProblem';

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
  fetchJson<Difficulties>(`${BASE_URL}/summary.json`);

// contests raw array
let CACHED_DIFFICULTIES: Difficulties;
export const cachedContestArray = async (): Promise<Difficulties> => {
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
