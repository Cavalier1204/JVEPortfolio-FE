import { SubjectCategory, SubjectType } from "../types";

export function SubjectEnumToPath(
  subjectEnum: SubjectType | string,
): SubjectCategory {
  switch (subjectEnum) {
    case "WERKPRAKTIJK_1":
    case "WERKPRAKTIJK_2":
      return "werkpraktijk";
    case "THEORIE":
    case "SKILLS":
      return "kennis";
    case "POSITIONERING":
      return "positionering";
    default:
      return "werkpraktijk";
  }
}

export function PathToSubjectEnums(
  path: SubjectCategory | string,
): SubjectType[] {
  switch (path) {
    case "werkpraktijk":
      return ["WERKPRAKTIJK_1", "WERKPRAKTIJK_2"];
    case "kennis":
      return ["THEORIE", "SKILLS"];
    case "positionering":
      return ["POSITIONERING"];
    default:
      return ["WERKPRAKTIJK_1", "WERKPRAKTIJK_2"];
  }
}

export default SubjectEnumToPath;
