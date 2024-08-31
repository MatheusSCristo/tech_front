import { SemesterUserType } from "@/types/semester";
import { SemesterSubjectType } from "@/types/semesterSubject";

export const getSubjectPreRequisitesNotFinished = (
  semesters: SemesterUserType[],
  subject: SemesterSubjectType,
  destinationSemesters: SemesterUserType
) => {
  const subjectPreRequisites = subject.subject.pre_requisites;

    const semestersBeforeIncludingDestinationSemester = semesters.filter(
    (item) => item.semester <= destinationSemesters.semester
  );

  const preRequisitesNotCompleted = subjectPreRequisites.filter(
    (subjectPreRequiste) =>
      semestersBeforeIncludingDestinationSemester.some((semester) => 
        semester.subjects.some((semesterSubject) => {
          if(semester.semester < destinationSemesters.semester) return false;
          return (
            semesterSubject.subject.id === subjectPreRequiste.id &&
            semesterSubject.finished == false 
          );
        })
      )
  );
  
  return preRequisitesNotCompleted;
};
