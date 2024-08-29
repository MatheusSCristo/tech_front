"use client";
import { UserContext } from "@/app/context/UserContext";
import { SemesterUserType } from "@/types/semester";
import { SubjectType } from "@/types/subject";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { CircularProgress } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import ErrorPopUp from "./ErrorPopUp";
import Semester from "./Semester";

const Semesters = () => {
  const { user } = useContext(UserContext);
  const [semesters, setSemesters] = useState<SemesterUserType[]>([]);
  const [error, setError] = useState(false);
  const subjects = semesters?.flatMap((item) => item.subjects);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [subjectError, setSubjectError] = useState("");

  //BUG DO NADA SOME VARIOS SEMESTRES

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

  const handleOnDragEnd = (result: DropResult) => {
    const { draggableId, destination } = result;
    if (!destination || !draggableId) return;
    const droppedSemester = semesters?.findIndex(
      (item) => item.id == destination.droppableId.split("semester-")[1]
    );
    const semesterSubjectDraggedFrom = semesters?.findIndex((item) =>
      item.subjects.some((item) => item.subject.id == draggableId)
    );
    if (droppedSemester == semesterSubjectDraggedFrom) {
      setSubjectError("Você não pode mover uma matéria para o mesmo semestre.");
      setOpenPopUp(true);
      return;
    }
    const subject = subjects?.find((item) => item.subject.id == draggableId);
    if (!subject) {
      setSubjectError("Nenhuma matéria selecionada.");
      setOpenPopUp(true);
      return;
    }
    const removedSubjectFromDraggedSemester = semesters[
      semesterSubjectDraggedFrom
    ].subjects.filter((item) => item != subject);

    const addedSubjectToDroppedSemester = [
      ...semesters[droppedSemester].subjects,
      subject,
    ];

    const updatedSemester = [...semesters];

    updatedSemester[semesterSubjectDraggedFrom] = {
      ...updatedSemester[semesterSubjectDraggedFrom],
      subjects: removedSubjectFromDraggedSemester,
    };

    updatedSemester[droppedSemester] = {
      ...updatedSemester[droppedSemester],
      subjects: addedSubjectToDroppedSemester,
    };

    if (!handleDragValidations(semesters[droppedSemester], subject.subject))
      return;
    setSemesters(updatedSemester);
  };

  const handleDragValidations = (
    semester: SemesterUserType,
    subject: SubjectType
  ) => {

    //NAO DEVE SER POSSIVEL MOVER UMA MATERIA PARA DPOIS DE UMA MATERIA Q TEM ELA COMO PRE REQUISITO


    const { pre_requisites: preRequisites, co_requisites: coRequisites } =
      subject;

    const itsPreRequisiteOfSubjectOnSemester = semester.subjects.find(
      (semesterSubject) =>
        semesterSubject.subject.pre_requisites.some(
          (requisite) => requisite.id === subject.id
        )
    );
    if (itsPreRequisiteOfSubjectOnSemester) {
      setSubjectError(
        `A matéria não pode ser movida para esse semestre,pois ${itsPreRequisiteOfSubjectOnSemester.subject.name} possui ela como pré-requisito.`
      );
      setOpenPopUp(true);
      return false;
    }

    if (preRequisites.length == 0 && coRequisites.length == 0) return true;
    const pastSemesters = semesters.filter(
      (item) => item.semester < semester.semester
    );
    const preRequisitesPaid = preRequisites.filter((preRequisite) => {
      return pastSemesters.some((item) => {
        return item.subjects.some(
          (subject) => preRequisite.id === subject.subject.id
        );
      });
    });

    if(preRequisitesPaid.length!=subject.pre_requisites.length){
      const preRequisitesNotPaid=subject.pre_requisites.findLast((preRequisite)=>!preRequisitesPaid.some((paid)=>paid.id==preRequisite.id))
      setSubjectError(
        `A matéria não pode ser movida para esse semestre,pois ${preRequisitesNotPaid?.name} ainda não foi concluido.`
      );
      setOpenPopUp(true);
      return false;

    }

  
    const coRequisitesPaid = coRequisites.filter((coRequisite) => {
      semester.subjects.some(
        (subject) => coRequisite.id === subject.subject.id
      );
    });

    if(coRequisitesPaid.length!=subject.co_requisites.length){
      const coRequisitesNotPaid=subject.co_requisites.findLast((coRequisite)=>!coRequisitesPaid.some((paid)=>paid.id==coRequisite.id))
      setSubjectError(
        `A matéria não pode ser movida para esse semestre,pois ${coRequisitesNotPaid?.name} é co-requisito.`
      );
      setOpenPopUp(true);
      return false;
    }


    return (
      preRequisitesPaid.length==subject.pre_requisites.length &&
      coRequisitesPaid.length==subject.co_requisites.length 
    );
  };

  return (
    <>
      <div className="bg-[#ffffffd6] m-10  flex flex-col items-center p-5 rounded-xl gap-10">
        <h1 className="text-[2.5em]">Semestres</h1>
        <div className="flex flex-col gap-10 min-h-screen">
          {semesters.length > 0 && (
            <DragDropContext onDragEnd={handleOnDragEnd}>
              {semesters?.map((semester, index) => (
                <Semester semester={semester} index={index} key={semester.id} />
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
          error={subjectError}
          handleClosePopUp={() => {
            setSubjectError("");
            setOpenPopUp(false);
          }}
        />
      )}
    </>
  );
};

export default Semesters;
