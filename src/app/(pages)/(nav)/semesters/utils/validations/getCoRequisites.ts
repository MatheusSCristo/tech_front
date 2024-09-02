import { SemesterUserType } from "@/types/semester";
import { SubjectType } from "@/types/subject";
import { Dispatch, SetStateAction } from "react";
import { getPrerequisitesPaid } from "../getPrequisitesPaid";
import { handleSwapSubjects } from "../handleSwapSubjects";

type SubjectErrorType = {
  option: string;
  error: string;
};

export const getSubjectCoRequisites = (
  setSemesters: Dispatch<SetStateAction<SemesterUserType[]>>,
  semesters: SemesterUserType[],
  semester: SemesterUserType,
  subject: SubjectType,
  setSubjectError: Dispatch<SetStateAction<SubjectErrorType>>,
  setOpenPopUp: Dispatch<SetStateAction<boolean>>,
  setResponseFunction: Dispatch<SetStateAction<() => void>>
) => {
  const { co_requisites: coRequisites } = subject;
  const coRequisitesPaid = coRequisites.filter((coRequisite) => {
    return semesters.some((allSemester) =>
      allSemester.subjects.some((subject) => {
        return coRequisite.id === subject.subject.id && subject.finished;
      })
    );
  });

  if (coRequisitesPaid.length != coRequisites.length) {
    const coRequisitesNotPaid = coRequisites.findLast(
      (coRequisite) =>
        !coRequisitesPaid.some((paid) => paid.id == coRequisite.id)
    );

    setSubjectError({
      option: "Deseja mover os co-requisitos também?",
      error: `Não é possível mover esta matéria para o semestre desejado,pois ${coRequisitesNotPaid?.name} é co-requisito.`,
    });
    if (coRequisitesNotPaid) {
      const checkIfCoRequisiteIsPreRequisiteOnNewSemester = (
        semester: SemesterUserType,
        subject: SubjectType
      ) => {
        const itsPreRequisiteOfSubjectOnSemester = semester.subjects.find(
          (semesterSubject) =>
            semesterSubject.subject.pre_requisites.some(
              (requisite) =>
                requisite.id === subject.id && !semesterSubject.finished
            )
        );

        if (itsPreRequisiteOfSubjectOnSemester) {
          setSubjectError({
            option: "",
            error: `Não é possível mover esta matéria para o semestre desejado,pois ${itsPreRequisiteOfSubjectOnSemester.subject.name} possui ela como pré-requisito.`,
          });
          setOpenPopUp(true);
        }
        return !itsPreRequisiteOfSubjectOnSemester;
      };

      const responseFunction = () => {
        const pastSemesters = semesters.filter(
          (item) => item.semester < semester.semester
        );
        const preRequisitesPaid = getPrerequisitesPaid(
          coRequisitesNotPaid.pre_requisites,
          pastSemesters
        );
        const preRequisitesNotPaid =
          coRequisitesNotPaid.pre_requisites.findLast(
            (preRequisite) =>
              !preRequisitesPaid.some((paid) => paid.id == preRequisite.id)
          );
        if (
          preRequisitesPaid.length !==
            coRequisitesNotPaid.pre_requisites.length &&
          preRequisitesNotPaid
        ) {
          setSubjectError({
            option: "",
            error: `Não é possível mover esta matéria para o semestre desejado,pois ${preRequisitesNotPaid.name} não foi concluida.`,
          });
          setOpenPopUp(true);
          return false;
        }
        if (
          checkIfCoRequisiteIsPreRequisiteOnNewSemester(
            semester,
            coRequisitesNotPaid
          )
        ) {
          const semesterSubjects = semesters.flatMap((item) => item.subjects);
          const semesterSubject = semesterSubjects.find(
            (semesterSubject) =>
              semesterSubject.subject.id == coRequisitesNotPaid.id
          );
          const initialSubjectToSwap = semesterSubjects.find(
            (item) => item.subject.id == subject.id
          );
          if (semesterSubject && initialSubjectToSwap) {
            {
              const newSemester = handleSwapSubjects(
                semesters,
                semesterSubject,
                semester.id
              );
              const updatedSemester = handleSwapSubjects(
                newSemester,
                initialSubjectToSwap,
                semester.id
              );
              setSemesters(updatedSemester);
            }
          }
          setOpenPopUp(false);
        }
      };
      setResponseFunction(() => responseFunction);
      setOpenPopUp(true);
      return false;
    }
  }
  return true;
};
