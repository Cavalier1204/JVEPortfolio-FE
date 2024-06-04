export default function SubjectEnumToPath(subjectEnum) {
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
