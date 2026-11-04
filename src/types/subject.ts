export type SubjectType =
  | "WERKPRAKTIJK_1"
  | "WERKPRAKTIJK_2"
  | "THEORIE"
  | "SKILLS"
  | "POSITIONERING"
  | "PORTFOLIO";

export type SubjectCategory = "werkpraktijk" | "kennis" | "positionering";

export interface SubjectItem {
  enumName: string;
  displayName: string;
}
