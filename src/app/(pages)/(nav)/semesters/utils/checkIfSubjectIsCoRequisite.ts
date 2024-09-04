import { SemesterUserType } from "@/types/semester";
import { SubjectType } from "@/types/subject";

export const checkIfSubjectIsCoRequisite = (semesters:SemesterUserType[],subject:SubjectType) => {
  
    const subjectsItsCoRequisitesOf = semesters.map((userSemester) =>
        userSemester.subjects.filter((semesterSubject) =>
          semesterSubject.subject.co_requisites.some(
            (coRequisite) => coRequisite.id == subject.id && !semesterSubject.finished
          )
        )
      )
      .flat();

    return subjectsItsCoRequisitesOf;

  };