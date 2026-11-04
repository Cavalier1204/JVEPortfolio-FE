import { SubjectItem } from "./subject";

export type SchoolYears = Record<string, number[]>;

export interface ModuleCategory {
  title: string;
  subjects: SubjectItem[];
}

export type ModulesMap = Record<string, ModuleCategory>;
