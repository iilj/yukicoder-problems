/** 言語ID */
export type LangId = string;

/** 利用できる言語 */
export interface Language {
  /** 言語ID　（一意な文字列） */
  readonly Id: LangId;
  /** 言語名 */
  readonly Name: string;
  /** コンパイラバージョン */
  readonly Ver: string;
}