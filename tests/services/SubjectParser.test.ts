import { describe, it, expect } from "vitest";
import { SubjectEnumToPath, PathToSubjectEnums } from "../../src/services/SubjectParser";

describe("SubjectParser", () => {
  describe("SubjectEnumToPath", () => {
    it("should map WERKPRAKTIJK_1 and WERKPRAKTIJK_2 to werkpraktijk", () => {
      expect(SubjectEnumToPath("WERKPRAKTIJK_1")).toBe("werkpraktijk");
      expect(SubjectEnumToPath("WERKPRAKTIJK_2")).toBe("werkpraktijk");
    });

    it("should map THEORIE and SKILLS to kennis", () => {
      expect(SubjectEnumToPath("THEORIE")).toBe("kennis");
      expect(SubjectEnumToPath("SKILLS")).toBe("kennis");
    });

    it("should map POSITIONERING to positionering", () => {
      expect(SubjectEnumToPath("POSITIONERING")).toBe("positionering");
    });

    it("should default to werkpraktijk for unknown subjects or PORTFOLIO", () => {
      expect(SubjectEnumToPath("PORTFOLIO")).toBe("werkpraktijk");
      expect(SubjectEnumToPath("UNKNOWN_VAL")).toBe("werkpraktijk");
    });
  });

  describe("PathToSubjectEnums", () => {
    it("should map werkpraktijk to WERKPRAKTIJK_1 and WERKPRAKTIJK_2", () => {
      expect(PathToSubjectEnums("werkpraktijk")).toEqual([
        "WERKPRAKTIJK_1",
        "WERKPRAKTIJK_2",
      ]);
    });

    it("should map kennis to THEORIE and SKILLS", () => {
      expect(PathToSubjectEnums("kennis")).toEqual(["THEORIE", "SKILLS"]);
    });

    it("should map positionering to POSITIONERING", () => {
      expect(PathToSubjectEnums("positionering")).toEqual(["POSITIONERING"]);
    });

    it("should default to WERKPRAKTIJK_1 and WERKPRAKTIJK_2 for unknown paths", () => {
      expect(PathToSubjectEnums("unknown")).toEqual([
        "WERKPRAKTIJK_1",
        "WERKPRAKTIJK_2",
      ]);
    });
  });
});
