"use client";
import { SemesterContext } from "@/app/context/SemesterContext";
import { UserContext } from "@/app/context/UserContext";
import { SemesterUserType } from "@/types/semester";
import { SemesterSubjectType } from "@/types/semesterSubject";
import { SubjectType } from "@/types/subject";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { CircularProgress } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import ErrorPopUp from "./ErrorPopUp";
import Semester from "./Semester";
import { handleSwapSubjects } from "./utils/handleSwapSubjects";
import handleResetSemesters from "./utils/resetSemester";
import handleSaveSemester from "./utils/saveSemesters";
import { checkSubjectItsCoRequisiteOf } from "./utils/validations/checkSubjectItsCoRequisitesOf";
import { getSubjectCoRequisites } from "./utils/validations/getCoRequisites";
import { getPrerequisiteDependencies } from "./utils/validations/getPrerequisiteDependencies ";
import { getSubjectPreRequisitesNotFinished } from "./utils/validations/getSubjectPreRequisitesNotFinished";


export type SemesterMessageType={
  message:string;
  error:boolean;
}

const Semesters = () => {
  const { user,setUser } = useContext(UserContext);
  const { semesters, setSemesters } = useContext(SemesterContext);
  const [error, setError] = useState(false);
  const subjects = semesters?.flatMap((item) => item.subjects);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [subjectError, setSubjectError] = useState({
    option: "",
    error: "",
  });
  const [responseFunction, setResponseFunction] = useState<() => void>(
    () => {}
  );
  const [hideSubjects, setHideSubjects] = useState(false);
  const [semesterMessage, setSemesterMessage] = useState({} as SemesterMessageType);


  useEffect(() => {
    const getSemesters = async () => {
      if (user) {
        try {
          const response = await fetch(`/api/getSemesterUsers?id=${user.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });
          if (!response.ok) {
            setError(true);
          }
          const data: SemesterUserType[] = await response.json();
          setSemesters(data.sort((a, b) => a.semester - b.semester));
        } catch (e: any) {
          setError(true);
        }
      }
    };
    getSemesters();
  }, [user]);

  const checkPreRequisitesNotPaid = (
    subject: SemesterSubjectType,
    destinationSemester: SemesterUserType
  ) => {
    const preRequisitesNotCompleted = getSubjectPreRequisitesNotFinished(
      semesters,
      subject,
      destinationSemester
    );

    if (preRequisitesNotCompleted.length > 0) {
      setSubjectError({
        option: "",
        error: `Não é possível mover ${subject.subject.name} para o semestre desejado, pois ${preRequisitesNotCompleted[0].name} é pré requisto e ainda não foi concluido.`,
      });
      setOpenPopUp(true);
      return false;
    }
    return true;
  };

  const checkPreRequisitesOfSubjectOnDestinationSemester = (
    subject: SemesterSubjectType,
    destinationSemester: SemesterUserType
  ) => {
    const preRequisitesOfSubjectOnDestinationSemester =
      getPrerequisiteDependencies(destinationSemester, subject);

    if (preRequisitesOfSubjectOnDestinationSemester) {
      setSubjectError({
        option: "",
        error: `Não é possível mover ${subject.subject.name} para o semestre desejado, pois ${preRequisitesOfSubjectOnDestinationSemester.subject.name} no semestre de destino exige esta como pré-requisito.`,
      });
      setOpenPopUp(true);
      return false;
    }
    return true;
  };

  const checkSubjectCoRequisiteIsPaid = (
    semesters: SemesterUserType[],
    destinationSemester: SemesterUserType,
    subject: SubjectType
  ) => {
    const coRequistesNotPaid = getSubjectCoRequisites(
      semesters,
      destinationSemester,
      subject
    );
    if (coRequistesNotPaid.length > 0) {
      setSubjectError({
        option: "",
        error: `Não é possível mover ${subject.name} para o semestre desejado, pois ${coRequistesNotPaid[0].name} é co-requisito e ainda não foi concluido.`,
      });
      setOpenPopUp(true);
      return false;
    }
    return true;
  };

  const handleOnDragEnd = (result: DropResult) => {
    const { draggableId, destination } = result;

    if (!destination || !draggableId) return;
    const droppedSemester = semesters?.findIndex(
      (item) => item.id == destination.droppableId.split("semester-")[1]
    );
    const destinationSemester = semesters[droppedSemester];
    const semesterSubjectDraggedFrom = semesters?.findIndex((item) =>
      item.subjects.some((item) => item.subject.id == draggableId)
    );

    if (droppedSemester == semesterSubjectDraggedFrom) {
      return;
    }
    const subject = subjects?.find((item) => item.subject.id == draggableId);
    if (!subject) {
      setSubjectError({ option: "", error: "Nenhuma matéria selecionada." });
      setOpenPopUp(true);
      return;
    }
    const canMoveSubject =
      checkPreRequisitesNotPaid(subject, destinationSemester) &&
      checkPreRequisitesOfSubjectOnDestinationSemester(
        subject,
        destinationSemester
      ) &&
      checkSubjectItsCoRequisiteOf(
        semesters,
        destinationSemester,
        subject.subject,
        setSubjectError,
        setOpenPopUp
      ) &&
      checkSubjectCoRequisiteIsPaid(
        semesters,
        destinationSemester,
        subject.subject
      );

    if (!canMoveSubject) return;

    const updatedSemester = handleSwapSubjects(
      semesters,
      subject,
      destination.droppableId.split("semester-")[1]
    );
    setSemesters(updatedSemester);
  };


  return (
    <>
      <div className="bg-[#ffffffd6] m-10  flex flex-col items-center p-5 rounded-xl gap-10">
        <div className="w-full relative flex justify-center">
          <h1 className="text-[2.5em]">Semestres</h1>
          <div className="absolute right-2 flex flex-col ">
            <button
              className="underline underline-offset-4 font-bold text-lg hover:scale-[1.05] duration-300,mm "
              onClick={() => handleSaveSemester(user?.id || "", semesters,setSemesters,setSemesterMessage,setUser)}
            >
              Salvar alterações
            </button>
            <button
              className="underline underline-offset-4 font-bold text-lg hover:scale-[1.05] duration-300,mm "
              onClick={() => handleResetSemesters(user?.id || "",setSemesters,setSemesterMessage,setUser)}
            >
              Resetar semestres
            </button>
            {semesterMessage.message && (
              <div className={`text-center ${semesterMessage.error ? "text-red-500" : "text-green-500"}`}>
                {semesterMessage.message}
              </div>
            )}
          </div>
        </div>
        <button
          className="self-end px-1 border-b-[1px] border-black hover:scale-[1.05] duration-300"
          onClick={() => setHideSubjects((prevState) => !prevState)}
        >
          {hideSubjects ? "Mostrar" : "Esconder"} componentes concluidos
        </button>
        <div className="flex flex-col gap-5 min-h-screen w-full">
          {semesters.length > 0 && (
            <DragDropContext onDragEnd={handleOnDragEnd}>
              {semesters?.map((semester, index) => (
                <Semester
                  hideSubjects={hideSubjects}
                  semester={semester}
                  index={index}
                  key={semester.id}
                />
              ))}
            </DragDropContext>
          )}
          {semesters.length == 0 && !error && (
            <div className="w-full h-full flex items-center justify-center">
              <CircularProgress />
            </div>
          )}
        </div>
      </div>
      {openPopUp && (
        <ErrorPopUp
          responseFunction={responseFunction}
          error={subjectError.error}
          option={subjectError.option}
          handleClosePopUp={() => {
            setSubjectError({ option: "", error: "" });
            setOpenPopUp(false);
          }}
        />
      )}
    </>
  );
};

export default Semesters;
