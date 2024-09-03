import { SemesterUserType } from "@/types/semester";
import { SemesterSubjectType } from "@/types/semesterSubject";
import { Dispatch, SetStateAction } from "react";

type ErrorType = {
  text: string;
  status: boolean;
};

const checkIfSubjectIsPreRequisiteOfSubjectFinished = (
  semesters: SemesterUserType[],
  subject: SemesterSubjectType
) => {
  const subjectPreRequisitesOfNotFinished = semesters
    .flatMap((semester) => semester.subjects)
    .filter((semesterSubject) =>
      semesterSubject.subject.pre_requisites.some(
        (prerequisite) => prerequisite.id === subject.subject.id
      )
    )
    .filter((semesterSubject) => semesterSubject.finished);

  return subjectPreRequisitesOfNotFinished;
};

const getNewNotFinishedSemesterSubjects = (
  semester: SemesterUserType,
  selectedSubjects: SemesterSubjectType[],
  semesters: SemesterUserType[],
  setError: Dispatch<SetStateAction<ErrorType>>
) => {
  const newSemesterSubjects = semester.subjects.map((semesterSubject) => {
    if (
      selectedSubjects.some(
        (selectedSubject) =>
          selectedSubject.subject.id === semesterSubject.subject.id
      )
    ) {
      if (
        checkIfSubjectIsPreRequisiteOfSubjectFinished(
          semesters,
          semesterSubject
        ).length
      ) {
        const subjectThatHasPrerequistesNotFinished = selectedSubjects
          .filter(
            (semesterSubject) =>
              checkIfSubjectIsPreRequisiteOfSubjectFinished(
                semesters,
                semesterSubject
              ).length
          )
          .flatMap((subject) => subject);

        const subjectThatHasPrerequistesNotFinishedText =
          subjectThatHasPrerequistesNotFinished
            .map((subject) => subject.subject.name)
            .join(", ");

        setError({
          text: `Não é possível marcar como não concluído o(s) componente(s) ${subjectThatHasPrerequistesNotFinishedText}, pois há componentes nos semestres futuros, já marcados como concluídos, que dependem dele(s) como pré-requisito.`,
          status: true,
        });
        return semesterSubject;
      }
      return {
        ...semesterSubject,
        finished: false,
      };
    }
    return {
      ...semesterSubject,
    };
  });
  return newSemesterSubjects;
};

export default getNewNotFinishedSemesterSubjects;
