import { SemesterUserType } from "@/types/semester";
import { SemesterSubjectType } from "@/types/semesterSubject";

export const getSubjectPreRequisitesNotFinished = (
  semesters: SemesterUserType[],
  subject: SemesterSubjectType,
  destinationSemesters: SemesterUserType
) => {
  const subjectPreRequisites = subject.subject.pre_requisites;

  const currentSemester = semesters.filter((item) =>
    item.subjects.some((semesterSubject) => semesterSubject.id === subject.id)
  )[0];

  const semestersBeforeIncludingDestinationSemester = semesters.filter(
    (item) => item.semester <= destinationSemesters.semester
  );

  const preRequisitesNotCompleted = subjectPreRequisites.filter(
    (subjectPreRequiste) =>
      semestersBeforeIncludingDestinationSemester.some((semester) => {
        if (semester.semester <= destinationSemesters.semester) {
          return false;
        }
        semester.subjects.some((semesterSubject) => {
          return (
            semesterSubject.subject.id === subjectPreRequiste.id &&
            semesterSubject.finished == false 
          );
        });
      })
  );
  return preRequisitesNotCompleted;
};
