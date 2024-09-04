import { SemesterUserType } from "@/types/semester";
import { SubjectType } from "@/types/subject";
import { Dispatch, SetStateAction } from "react";
import { checkIfSubjectIsCoRequisite } from "../checkIfSubjectIsCoRequisite";

type SubjectErrorType = {
  option: string;
  error: string;
};

export const checkSubjectItsCoRequisiteOf = (
  semesters: SemesterUserType[],
  destinationSemester: SemesterUserType,
  subject: SubjectType,
  setSubjectError: Dispatch<SetStateAction<SubjectErrorType>>,
  setOpenPopUp: Dispatch<SetStateAction<boolean>>
) => {
  const subjectsItsCoRequisitesOf = checkIfSubjectIsCoRequisite(
    semesters,
    subject
  );
  if (subjectsItsCoRequisitesOf.length == 0) return true;
  const semestersWithSubject = semesters.filter((semester) =>
    semester.subjects.some(
      (subject) => subject.subject.id == subjectsItsCoRequisitesOf[0].subject.id
    )
  );
  console.log(destinationSemester.semester, semestersWithSubject[0].semester);

  if (semestersWithSubject[0].semester < destinationSemester.semester) {
    setSubjectError({
      option: "",
      error: `Não é possível mover ${subject.name} para o semestre desejado, pois ${subjectsItsCoRequisitesOf[0].subject.name} é co-requisito e ainda não foi concluido.`,
    });
    setOpenPopUp(true);
    return false;
  }
  return true;
};
