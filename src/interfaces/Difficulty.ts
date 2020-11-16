import { UserId } from './User';

/** Difficulty */
export type Difficulty = number;

/** { [key: 問題ID]: (diff, coef, bias, augmented) } */
export type Difficulties = {
  [key: number]: [Difficulty, number, number, boolean];
};

export interface DifficultyDetailUserData {
  inner_rating: number;
  solved: number;
  user_id: UserId;
  atcoder_user_name: string;
}

export interface DifficultyDetailData {
  difficulty: number;
  coef: number;
  bias: number;
  augmented: boolean;
  detail: DifficultyDetailUserData[];
}
