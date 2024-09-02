import { SemesterUserType } from "@/types/semester";
import { SemesterSubjectType } from "@/types/semesterSubject";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { useState } from "react";
import ErrorPopUp from "../ErrorPopUp";
import SubjectModal from "../SubjectModal";

type ErrorType = {
  text: string;
  status: boolean;
};

const Semester = ({
  semester,
  index,
  setSemesters,
  semesters,
}: {
  semester: SemesterUserType;
  index: number;
  setSemesters: React.Dispatch<React.SetStateAction<SemesterUserType[]>>;
  semesters: SemesterUserType[];
}) => {
  const [error, setError] = useState({} as ErrorType);

  const checkIfPreRequisitesAreFinished = (subject: SemesterSubjectType) => {
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

  const handleFinishAllSubjects = () => {
    const newSemesterSubjects = semester.subjects.map((semesterSubject) => {
      if (checkIfPreRequisitesAreFinished(semesterSubject).length) {
        const subjectThatHasPrerequistesNotFinished = semester.subjects
          .filter((semesterSubject) =>
            checkIfPreRequisitesAreFinished(semesterSubject).length
          )
          .flatMap((subject) => subject);

          const subjectThatHasPrerequistesNotFinishedText=subjectThatHasPrerequistesNotFinished.map((subject)=>subject.subject.name).join(", ");

        setError({
          text: `Não é possível concluir os componentes ${subjectThatHasPrerequistesNotFinishedText}. Pois possuem pre requisitos  não concluidos.`,
          status: true,
        });
        return semesterSubject;
      }
      return {
        ...semesterSubject,
        finished: true,
      };
    });
    setSemesters((prevState) =>
      prevState.map((oldSemester) => {
        if (oldSemester.id === semester.id) {
          return { ...oldSemester, subjects: newSemesterSubjects };
        } else {
          return oldSemester;
        }
      })
    );
  };

  return (
    <>
      <Droppable
        droppableId={`semester-${semester.id}`}
        type="list"
        direction="horizontal"
      >
        {(provided) => (
          <div className="flex flex-col border-b-[1px] border-black pb-5 gap-2">
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex items-center"
            >
              <span className="font-bold text-xl">{semester.semester}°</span>
              <div className="flex flex-wrap gap-10 justify-center w-full">
                {semester.subjects.map((subject, index) => (
                  <Subject
                    subject={subject}
                    index={index}
                    key={subject.id}
                    setSemesters={setSemesters}
                    semester={semester}
                    semesters={semesters}
                  />
                ))}
              </div>
              {provided.placeholder}
            </div>
            <button
              className="self-end border-black border px-1 rounded"
              onClick={handleFinishAllSubjects}
            >
              Marcar todos como concluidos
            </button>
          </div>
        )}
      </Droppable>
      {error.status && (
        <ErrorPopUp
          error={error.text}
          handleClosePopUp={() => setError({} as ErrorType)}
        />
      )}
    </>
  );
};

export default Semester;

const Subject = ({
  subject,
  index,
  setSemesters,
  semester,
  semesters,
}: {
  subject: SemesterSubjectType;
  index: number;
  setSemesters: React.Dispatch<React.SetStateAction<SemesterUserType[]>>;
  semester: SemesterUserType;
  semesters: SemesterUserType[];
}) => {
  const [openSubjectPopUp, setOpenSubjectPopUp] = useState(false);

  return (
    <>
      <Draggable draggableId={subject.subject.id} index={index}>
        {(provided) => (
          <div
            onClick={() => setOpenSubjectPopUp(true)}
            onDrag={() => setOpenSubjectPopUp(false)}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`${
              subject.finished ? "opacity-[50%]" : "opacity-1"
            } overflow-hidden bg-mandatoryBlue border border-black h-[200px] w-[10%] flex items-center justify-center rounded p-3`}
          >
            <span className="text-center text-wrap truncate">
              {subject.subject.name}
            </span>
          </div>
        )}
      </Draggable>
      {openSubjectPopUp && (
        <SubjectModal
          subject={subject}
          handleClose={() => setOpenSubjectPopUp(false)}
          setSemesters={setSemesters}
          semester={semester}
          semesters={semesters}
        />
      )}
    </>
  );
};
