import { SemesterUserType } from "@/types/semester";
import { SemesterSubjectType } from "@/types/semesterSubject";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
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
  hideSubjects,
}: {
  semester: SemesterUserType;
  index: number;
  setSemesters: React.Dispatch<React.SetStateAction<SemesterUserType[]>>;
  semesters: SemesterUserType[];
  hideSubjects: boolean;
}) => {
  const [error, setError] = useState({} as ErrorType);
  const [selectingSubjects, setSelectingSubjects] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState(
    [] as SemesterSubjectType[]
  );
  const [selectAllSubjects, setSelectAllSubjects] = useState(false);

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
      if (
        selectedSubjects.some(
          (selectedSubject) =>
            selectedSubject.subject.id === semesterSubject.subject.id
        )
      ) {
        if (checkIfPreRequisitesAreFinished(semesterSubject).length) {
          const subjectThatHasPrerequistesNotFinished = selectedSubjects
            .filter(
              (semesterSubject) =>
                checkIfPreRequisitesAreFinished(semesterSubject).length
            )
            .flatMap((subject) => subject);

          const subjectThatHasPrerequistesNotFinishedText =
            subjectThatHasPrerequistesNotFinished
              .map((subject) => subject.subject.name)
              .join(", ");

          setError({
            text: `Não é possível concluir os componentes ${subjectThatHasPrerequistesNotFinishedText}. Pois possuem pré requisitos  não concluidos.`,
            status: true,
          });
          return semesterSubject;
        }
        return {
          ...semesterSubject,
          finished: true,
        };
      }
      return {
        ...semesterSubject,
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
    setSelectedSubjects([]);
    setSelectingSubjects(false);
  };

  useEffect(() => {
    if (selectAllSubjects) {
      setSelectedSubjects(semester.subjects);
    } else {
      setSelectedSubjects([]);
    }
  }, [selectAllSubjects]);

  return (
    <>
      <Droppable
        droppableId={`semester-${semester.id}`}
        type="list"
        direction="horizontal"
      >
        {(provided) => (
          <div className="px-2 flex flex-col border-b-[1px] border-black pb-5 gap-2 min-h-[200px] justify-center">
            <button
              className=" self-start px-1 border-b-[1px] border-black hover:scale-[1.05] duration-300"
              onClick={() => setSelectingSubjects((prevState) => !prevState)}
            >
              Selecionar
            </button>

            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex items-center"
            >
              <span className="font-bold text-xl">{semester.semester}°</span>
              <div className="flex flex-wrap gap-10 justify-center w-full">
                {semester.subjects.length > 0 &&
                  semester.subjects.map((subject, index) => {
                    if (subject.finished && hideSubjects) return null;
                    return (
                      <Subject
                        setSelectedSubjects={setSelectedSubjects}
                        subject={subject}
                        index={index}
                        key={subject.id}
                        setSemesters={setSemesters}
                        semester={semester}
                        selecting={selectingSubjects}
                        semesters={semesters}
                        selectedSubjects={selectedSubjects}
                      />
                    );
                  })}
                {((semester.subjects.every((subject) => subject.finished) &&
                  hideSubjects) ||
                  semester.subjects.length === 0) && (
                  <h2 className="font-bold">
                    Nenhum componente para exibir...
                  </h2>
                )}
              </div>
              {provided.placeholder}
            </div>
            {selectingSubjects && (
              <div className="self-end flex justify-between w-full">
                <div className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    id="selectAll"
                    onChange={() =>
                      setSelectAllSubjects((prevState) => !prevState)
                    }
                    checked={selectAllSubjects}
                  />
                  <label htmlFor="selectAll">Selecionar todos</label>
                </div>
                <button
                  className="border-black border-b-[1px] px-1  hover:scale-[1.05] duration-300"
                  onClick={handleFinishAllSubjects}
                >
                  Marcar como concluido{selectedSubjects.length <= 1 ? "" : "s"}{" "}
                  ({selectedSubjects.length})
                </button>
              </div>
            )}
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
  setSelectedSubjects,
  selecting,
  selectedSubjects,
}: {
  subject: SemesterSubjectType;
  index: number;
  setSemesters: React.Dispatch<React.SetStateAction<SemesterUserType[]>>;
  semester: SemesterUserType;
  semesters: SemesterUserType[];
  selectedSubjects: SemesterSubjectType[];
  setSelectedSubjects: React.Dispatch<
    React.SetStateAction<SemesterSubjectType[]>
  >;
  selecting: boolean;
}) => {
  const [openSubjectPopUp, setOpenSubjectPopUp] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleChecked = () => {
    if (!checked) setSelectedSubjects((prevState) => [...prevState, subject]);
    else
      setSelectedSubjects((prevState) =>
        prevState.filter((item) => item.id !== subject.id)
      );
  };

  useEffect(() => {
    if (selectedSubjects.some((item) => item.id === subject.id)) {
      setChecked(true);
      return;
    }
    setChecked(false);
  }, [selectedSubjects]);

  useEffect(() => {
    if (!selecting) setChecked(false);
  }, [selecting]);

  return (
    <>
      <Draggable draggableId={subject.subject.id} index={index}>
        {(provided) => (
          <div className="flex flex-col h-[200px] relative ">
            {selecting && (
              <div
                className="h-full w-full absolute cursor-pointer z-10"
                onClick={handleChecked}
              >
                <input
                  checked={checked}
                  className="self-start m-1"
                  type="checkbox"
                  readOnly
                />
              </div>
            )}
            <div
              onClick={() => setOpenSubjectPopUp(true)}
              onDrag={() => setOpenSubjectPopUp(false)}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={`${
                subject.finished ? "opacity-[50%]" : "opacity-1"
              } m-2 overflow-hidden bg-mandatoryBlue border border-black h-[200px] w-[10vw] flex items-center justify-center rounded p-3`}
            >
              <span className="text-center text-wrap truncate">
                {subject.subject.name}
              </span>
            </div>
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
