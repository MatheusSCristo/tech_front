import { SemesterUserType } from "@/types/semester";
import { SubjectType } from "@/types/subject";
import { Dispatch, SetStateAction } from "react";
import { checkIfSubjectIsCoRequisite } from "./checkIfSubjectIsCoRequisite";
import { getPrerequisitesPaid } from "./getPrequisitesPaid";
import { handleSwapSubjects } from "./handleSwapSubjects";

type SubjectErrorType = {
  option: boolean;
  error: string;
};

const checkIfTheresAnyPreRequisitesBeforeSemester = (
  semesters: SemesterUserType[],
  semester: SemesterUserType,
  subject: SubjectType
) => {
  const pastSemesters = semesters.filter(
    (item) => item.semester < semester.semester
  );
  const semesterHasSubjectThatHasPreRequisite = pastSemesters.filter(
    (pastSemester) =>
      pastSemester.subjects.some((semesterSubject) =>
        semesterSubject.subject.pre_requisites.some(
          (preRequisite) => preRequisite.id === subject.id
        )
      )
  );
  return semesterHasSubjectThatHasPreRequisite;
};

export const handleDragValidations = (
  setSemesters: Dispatch<SetStateAction<SemesterUserType[]>>,
  semesters: SemesterUserType[],
  semester: SemesterUserType,
  subject: SubjectType,
  setSubjectError: Dispatch<SetStateAction<SubjectErrorType>>,
  setOpenPopUp: Dispatch<SetStateAction<boolean>>,
  setResponseFunction: Dispatch<SetStateAction<() => void>>
) => {
  const { pre_requisites: preRequisites, co_requisites: coRequisites } =
    subject;

  // const preRequisitesBeforeSemester =
  //   checkIfTheresAnyPreRequisitesBeforeSemester(semesters, semester, subject);
  // if (preRequisitesBeforeSemester.length > 0) {
  //   const subjectThatHasPreRequisite =
  //     preRequisitesBeforeSemester[0].subjects.filter((semesterSubject) =>
  //       semesterSubject.subject.pre_requisites.some(
  //         (preRequisite) => preRequisite.id === subject.id
  //       )
  //     );
  //   setSubjectError({
  //     option: false,
  //     error: `Não é possível mover esta matéria para o semestre desejado, pois ${subjectThatHasPreRequisite[0].subject.name} em um semestre anterior exige esta como pré-requisito.`,
  //   });
  //   setOpenPopUp(true);
  //   return false;
  // }

  // const itsPreRequisiteOfSubjectOnSemester = semester.subjects.find(
  //   (semesterSubject) =>
  //     semesterSubject.subject.pre_requisites.some(
  //       (requisite) => requisite.id === subject.id
  //     )
  // );
  // if (itsPreRequisiteOfSubjectOnSemester) {
  //   setSubjectError({
  //     option: false,
  //     error: `Não é possível mover esta matéria para o semestre desejado,pois ${itsPreRequisiteOfSubjectOnSemester.subject.name} possui ela como pré-requisito.`,
  //   });
  //   setOpenPopUp(true);
  //   return false;
  // }

  if (preRequisites.length == 0 && coRequisites.length == 0) return true;
  const pastSemesters = semesters.filter(
    (item) => item.semester < semester.semester
  );

  // const preRequisitesPaid = getPrerequisitesPaid(preRequisites, pastSemesters);

  // if (preRequisitesPaid.length != subject.pre_requisites.length) {
  //   const preRequisitesNotPaid = subject.pre_requisites.findLast(
  //     (preRequisite) =>
  //       !preRequisitesPaid.some((paid) => paid.id == preRequisite.id)
  //   );
  //   setSubjectError({
  //     option: false,
  //     error: `Não é possível mover esta matéria para o semestre desejado,pois ${preRequisitesNotPaid?.name} ainda não foi concluido.`,
  //   });
  //   setOpenPopUp(true);
  //   return false;
  // }

  const coRequisitesPaid = coRequisites.filter((coRequisite) => {
    semester.subjects.some((subject) => coRequisite.id === subject.subject.id);
  });

  if (coRequisitesPaid.length != subject.co_requisites.length) {
    const coRequisitesNotPaid = subject.co_requisites.findLast(
      (coRequisite) =>
        !coRequisitesPaid.some((paid) => paid.id == coRequisite.id)
    );
    setSubjectError({
      option: true,
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
              (requisite) => requisite.id === subject.id
            )
        );

        if (itsPreRequisiteOfSubjectOnSemester) {
          setSubjectError({
            option: false,
            error: `Não é possível mover esta matéria para o semestre desejado,pois ${itsPreRequisiteOfSubjectOnSemester.subject.name} possui ela como pré-requisito.`,
          });
          setOpenPopUp(true);
        }
        return !itsPreRequisiteOfSubjectOnSemester;
      };

      const responseFunction = () => {
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
            option: false,
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

  const subjectsItsCoRequisitesOf = checkIfSubjectIsCoRequisite(
    semesters,
    subject
  );
  if (subjectsItsCoRequisitesOf.length > 0) {
    setSubjectError({
      option: true,
      error: `A matéria não pode ser movida ,pois ${subjectsItsCoRequisitesOf[0].subject.name} possui ela como co-requisito.`,
    });
    const responseFunction = () => {
      const semesterSubjects = semesters.flatMap((item) => item.subjects);
      const semesterSubject = semesterSubjects.find(
        (semesterSubject) => semesterSubject.subject.id == subject.id
      );
      const initialSubjectToSwap = semesterSubjects.find(
        (item) => item.subject.id == subjectsItsCoRequisitesOf[0].subject.id
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
    };
    setResponseFunction(() => responseFunction);

    setOpenPopUp(true);
    return false;
  }

  return (
    coRequisitesPaid.length == subject.co_requisites.length
  );
};
