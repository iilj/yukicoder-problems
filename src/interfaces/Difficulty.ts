import { UserId } from './User';

/** Difficulty */
export type Difficulty = number;

/** { [key: 問題ID]: Difficulty } */
export type Difficulties = { [key: number]: Difficulty };

export interface DifficultyDetailUserData {
  inner_rating: number;
  solved: number;
  user_id: UserId;
  atcoder_user_name: string;
}

export interface DifficultyDetailData {
  coef: number;
  bias: number;
  difficulty: number;
  detail: DifficultyDetailUserData[];
}
