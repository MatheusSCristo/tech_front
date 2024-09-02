import { SemesterUserType } from "@/types/semester";
import { SubjectType } from "@/types/subject";
import { Dispatch, SetStateAction } from "react";
import { checkIfSubjectIsCoRequisite } from "../checkIfSubjectIsCoRequisite";
import { handleSwapSubjects } from "../handleSwapSubjects";

type SubjectErrorType = {
  option: string;
  error: string;
};

export const checkSubjectItsCoRequisiteOf = (
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


  if (preRequisites.length == 0 && coRequisites.length == 0) return true;
  const subjectsItsCoRequisitesOf = checkIfSubjectIsCoRequisite(
    semesters,
    subject
  );

  if (subjectsItsCoRequisitesOf.length > 0) {
    setSubjectError({
      option: "Deseja mover as matérias que a tem co requisito também?",
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

  return true;
};
