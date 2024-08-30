import { SemesterUserType } from "@/types/semester";
import { SubjectType } from "@/types/subject";

export const checkIfSubjectIsCoRequisite = (semesters:SemesterUserType[],subject:SubjectType) => {
    const subjectsItsCoRequisitesOf = semesters
      .filter((item) =>
        item.subjects.some(
          (semesterSubject) => semesterSubject.subject.id == subject.id
        )
      )
      .map((userSemester) =>
        userSemester.subjects.filter((semesterSubject) =>
          semesterSubject.subject.co_requisites.some(
            (coRequisite) => coRequisite.id == subject.id
          )
        )
      )
      .flat();

    return subjectsItsCoRequisitesOf;

  };