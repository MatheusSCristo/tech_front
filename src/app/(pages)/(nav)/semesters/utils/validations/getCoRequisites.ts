import { SemesterUserType } from "@/types/semester";
import { SubjectType } from "@/types/subject";

type SubjectErrorType = {
  option: string;
  error: string;
};

export const getSubjectCoRequisites = (
  semesters: SemesterUserType[],
  semester: SemesterUserType,
  subject: SubjectType,
) => {
  const { co_requisites: coRequisites } = subject;

  const coRequisitesNotPaid= coRequisites.filter((coRequisite) => {
    return semesters.some((allSemester) =>
      allSemester.subjects.some((subject) => {
        if(allSemester.semester > semester.semester){
          return coRequisite.id === subject.subject.id && !subject.finished;
        }
      })
    );
  })

  return coRequisitesNotPaid
};
