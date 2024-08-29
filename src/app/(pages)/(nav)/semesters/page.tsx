"use client";
import { UserContext } from "@/app/context/UserContext";
import { SemesterUserType } from "@/types/semester";
import { SubjectType } from "@/types/subject";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { useContext, useEffect, useState } from "react";

const Semesters = () => {
  const { user } = useContext(UserContext);
  const [semesters, setSemesters] = useState<SemesterUserType[]>([]);
  const subjects = semesters?.flatMap((item) => item.subjects);

  //BUG DO NADA SOME VARIOS SEMESTRES

  useEffect(() => {
    if (user) {
      setSemesters(user.semesters.sort((a, b) => a.semester - b.semester));
      //FETCH SEMESTERS FOR REAL-TIME-UPDATES
    }
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
      return;
    }
    const subject = subjects?.find((item) => item.subject.id == draggableId);
    if (!subject) return;
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
    const { pre_requisites: preRequisites, co_requisites: coRequisites } =
      subject;
    if (preRequisites.length == 0 && coRequisites.length == 0) return true;
    const pastSemesters = semesters.filter(
      (item) => item.semester < semester.semester
    );
    const preRequisitesPaid = preRequisites.every((preRequisite) => {
      return pastSemesters.some((item) => {
        return item.subjects.some(
          (subject) => preRequisite.id === subject.subject.id
        );
      });
    });

    const coRequisitesPaid = coRequisites.every((coRequisite) => {
      semester.subjects.some(
        (subject) => coRequisite.id === subject.subject.id
      );
    });
    return preRequisitesPaid && coRequisitesPaid;
  };

  return (
    <div className="bg-[#ffffffd6] m-10  flex flex-col items-center p-5 rounded-xl gap-10">
      <h1 className="text-[2.5em]">Semestres</h1>
      <div className="flex flex-col gap-10 ">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          {semesters?.map((semester, index) => (
            <Semester semester={semester} index={index} key={semester.id} />
          ))}
        </DragDropContext>
      </div>
    </div>
  );
};

export default Semesters;

const Semester = ({
  semester,
  index,
}: {
  semester: SemesterUserType;
  index: number;
}) => {
  return (
    <Droppable
      droppableId={`semester-${semester.id}`}
      type="list"
      direction="horizontal"
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="flex items-center border-b-[1px] border-black pb-5"
        >
          <span className="font-bold text-xl">{semester.semester}°</span>
          <div className="flex flex-wrap gap-10 justify-center w-full">
            {semester.subjects.map((subject, index) => (
              <Draggable
                key={subject.id}
                draggableId={subject.subject.id}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="overflow-hidden bg-mandatoryBlue border border-black h-[200px] w-[10%] flex items-center justify-center rounded p-3"
                  >
                    <span className="text-center text-wrap truncate">
                      {subject.subject.name}
                    </span>
                  </div>
                )}
              </Draggable>
            ))}
          </div>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
