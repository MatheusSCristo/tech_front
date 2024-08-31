import { SemesterUserType } from "@/types/semester";
import { SemesterSubjectType } from "@/types/semesterSubject";

export const getPrerequisiteDependencies = (
  destinationSemester: SemesterUserType,
  subject: SemesterSubjectType
) => {
  const destinationSemesterSubjectsPrequisites =
    destinationSemester.subjects.flatMap((item) => item.subject.pre_requisites);

  const response = destinationSemesterSubjectsPrequisites.filter(
    (item) => item.id === subject.subject.id
  )[0];

  const subjectThatHasPreRequisite = destinationSemester.subjects.filter(
    (item) =>
      item.subject.pre_requisites.some(
        (preRequisite) => preRequisite.id === subject.subject.id
      )
  )[0];

  return subjectThatHasPreRequisite;
};
