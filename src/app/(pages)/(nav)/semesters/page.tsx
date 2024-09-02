"use client";
import { UserContext } from "@/app/context/UserContext";
import { SemesterUserType } from "@/types/semester";
import { SemesterSubjectType } from "@/types/semesterSubject";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { CircularProgress } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import ErrorPopUp from "./ErrorPopUp";
import Semester from "./Semester";
import { handleSwapSubjects } from "./utils/handleSwapSubjects";
import { checkSubjectItsCoRequisiteOf } from "./utils/validations/checkSubjectItsCoRequisitesOf";
import { getSubjectCoRequisites } from "./utils/validations/getCoRequisites";
import { getPrerequisiteDependencies } from "./utils/validations/getPrerequisiteDependencies ";
import { getSubjectPreRequisitesNotFinished } from "./utils/validations/getSubjectPreRequisitesNotFinished";

const Semesters = () => {
  const { user } = useContext(UserContext);
  const [semesters, setSemesters] = useState<SemesterUserType[]>([]);
  const [error, setError] = useState(false);
  const subjects = semesters?.flatMap((item) => item.subjects);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [subjectError, setSubjectError] = useState({
    option: false,
    error: "",
  });
  const [responseFunction, setResponseFunction] = useState<() => void>(
    () => {}
  );

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
        option: false,
        error: `Não é possível mover esta matéria para o semestre desejado, pois ${preRequisitesNotCompleted[0].name} é pré requisto e ainda não foi concluido.`,
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
        option: false,
        error: `Não é possível mover esta matéria para o semestre desejado, pois ${preRequisitesOfSubjectOnDestinationSemester.subject.name} no semestre de destino exige esta como pré-requisito.`,
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
      setSubjectError({ option: false, error: "Nenhuma matéria selecionada." });
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
        setSemesters,
        semesters,
        destinationSemester,
        subject.subject,
        setSubjectError,
        setOpenPopUp,
        setResponseFunction
      ) &&
      getSubjectCoRequisites(
        setSemesters,
        semesters,
        destinationSemester,
        subject.subject,
        setSubjectError,
        setOpenPopUp,
        setResponseFunction);

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
        <h1 className="text-[2.5em]">Semestres</h1>
        <div className="flex flex-col gap-10 min-h-screen">
          {semesters.length > 0 && (
            <DragDropContext onDragEnd={handleOnDragEnd}>
              {semesters?.map((semester, index) => (
                <Semester
                  semester={semester}
                  index={index}
                  key={semester.id}
                  setSemesters={setSemesters}
                />
              ))}
            </DragDropContext>
          )}
          {semesters.length == 0 && !error && (
            <div>
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
            setSubjectError({ option: false, error: "" });
            setOpenPopUp(false);
          }}
        />
      )}
    </>
  );
};

export default Semesters;
