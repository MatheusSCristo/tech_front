import { SemesterUserType } from "@/types/semester";
import { SemesterSubjectType } from "@/types/semesterSubject";
import { Dispatch, SetStateAction } from "react";

type ErrorType = {
  text: string;
  status: boolean;
};

const checkIfPreRequisitesAreFinished = (
  semesters: SemesterUserType[],
  subject: SemesterSubjectType
) => {
  const preRequisites = subject.subject.pre_requisites;
  const preRequisitesNotFinished = preRequisites.filter((prerequisite) =>
    semesters.some((semester) =>
      semester.subjects.some(
        (semesterSubject) =>
          semesterSubject.subject.id === prerequisite.id &&
          !semesterSubject.finished
      )
    )
  );
  return preRequisitesNotFinished;
};

const getNewFinishedSemestersSubjects = (
  semester: SemesterUserType,
  selectedSubjects: SemesterSubjectType[],
  semesters: SemesterUserType[],
  setError: Dispatch<SetStateAction<ErrorType>>
) => {

  const newSemesterSubjects = semester.subjects.map((semesterSubject) => {
    if (selectedSubjects.some((selectedSubject) =>
          selectedSubject.subject.id === semesterSubject.subject.id)) {
      if (checkIfPreRequisitesAreFinished(semesters, semesterSubject).length) {
        const subjectThatHasPrerequistesNotFinished = selectedSubjects
          .filter(
            (semesterSubject) =>
              checkIfPreRequisitesAreFinished(semesters, semesterSubject).length
          )
          .flatMap((subject) => subject);

        const subjectThatHasPrerequistesNotFinishedText =
          subjectThatHasPrerequistesNotFinished
            .map((subject) => subject.subject.name)
            .join(", ");

        setError({
          text: `Não é possível concluir os componentes ${subjectThatHasPrerequistesNotFinishedText}. Pois possuem pré requisitos não concluidos.`,
          status: true,
        });
        return semesterSubject;
      }
      return {
        ...semesterSubject,
        finished: true,
      };
    }
    return {
      ...semesterSubject,
    };
  });
  return newSemesterSubjects;
};

export default getNewFinishedSemestersSubjects;
