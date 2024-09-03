import { SemesterUserType } from "@/types/semester";
import { SemesterSubjectType } from "@/types/semesterSubject";
import { Droppable } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import ErrorPopUp from "../ErrorPopUp";
import Subject from "./Subject";
import { default as getNewFinishedSemestersSubjects } from "./util/getNewFinishedSemesterSubjects";
import getNewNotFinishedSemesterSubjects from "./util/getNewNotFinishedSubjects";

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

 
  const handleFinishAllSubjects = () => {
    setSemesters((prevState) =>
      prevState.map((oldSemester) => {
        if (oldSemester.id === semester.id) {
          return { ...oldSemester, subjects: getNewFinishedSemestersSubjects(oldSemester, selectedSubjects,semesters,setError) };
        } else {
          return oldSemester;
        }
      })
    );
    setSelectedSubjects([]);
    setSelectAllSubjects(false);
    setSelectingSubjects(false);
  };


  const handleNotFinishedSubjects = () => {
    const newSubjects= getNewNotFinishedSemesterSubjects(semester, selectedSubjects,semesters,setError);
    setSemesters((prevState) =>
    prevState.map((oldSemester) => {
      if (oldSemester.id === semester.id) {
        return { ...oldSemester, subjects:newSubjects };
      } else {
        return oldSemester;
      }
    })
  );
  setSelectedSubjects([]);
  setSelectAllSubjects(false);
  setSelectingSubjects(false);
  }

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
                <div className="flex flex-col">
                <button
                  className="border-black border-b-[1px] px-1  hover:scale-[1.05] duration-300"
                  onClick={handleFinishAllSubjects}
                  >
                  Marcar como concluido{selectedSubjects.length <= 1 ? "" : "s"}{" "}
                  ({selectedSubjects.length})
                </button>
                <button
                  className="border-black border-b-[1px] px-1  hover:scale-[1.05] duration-300"
                  onClick={handleNotFinishedSubjects}
                  >
                  Marcar não como concluido{selectedSubjects.length <= 1 ? "" : "s"}{" "}
                  ({selectedSubjects.length})
                </button>
                  </div>
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

