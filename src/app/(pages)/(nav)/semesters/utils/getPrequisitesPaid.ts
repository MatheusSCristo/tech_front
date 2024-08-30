import { SemesterUserType } from "@/types/semester";
import { SubjectType } from "@/types/subject";

export const getPrerequisitesPaid = (
  preRequisites: SubjectType[],
  pastSemesters: SemesterUserType[]
) => {
  return preRequisites.filter((preRequisite) => {
    return pastSemesters.some((item) => {
      return item.subjects.some(
        (subject) => preRequisite.id === subject.subject.id
      );
    });
  });
};
