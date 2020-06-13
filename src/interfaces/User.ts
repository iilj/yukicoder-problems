/* ユーザーID */
export type UserId = number;

/** ユーザー名 */
export type UserName = string;

/** ユーザ */
export interface User {
  /** ユーザーID */
  readonly Id: UserId;
  /** ユーザー名 */
  readonly Name: UserName;
  /** 解いている問題数 */
  readonly Solved: number;
  /** ユーザーLevel */
  readonly Level: number;
  /** ユーザーLevel（小数） */
  readonly LevelFloat: number;
  /** 解いている問題数内でのランキング */
  readonly Rank: number;
  /** スコア */
  readonly Score: number;
  /** ゆるふわポイント */
  readonly Points: number;
  /** 注意事項など */
  readonly Notice: string;
}
