import { SemesterContext } from "@/app/context/SemesterContext";
import { SemesterUserType } from "@/types/semester";
import { SemesterSubjectType } from "@/types/semesterSubject";
import { Droppable } from "@hello-pangea/dnd";
import { useContext, useEffect, useState } from "react";
import ErrorPopUp from "../ErrorPopUp";
import OptionalSubjectBox from "./OptionalSubjectBox";
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
  hideSubjects,
}: {
  semester: SemesterUserType;
  index: number;
  hideSubjects: boolean;
}) => {
  const [error, setError] = useState({} as ErrorType);
  const [selectingSubjects, setSelectingSubjects] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState(
    [] as SemesterSubjectType[]
  );
  const [selectAllSubjects, setSelectAllSubjects] = useState(false);
  const { semesters, setSemesters } = useContext(SemesterContext);

  const handleFinishAllSubjects = () => {
    setSemesters((prevState) =>
      prevState.map((oldSemester) => {
        if (oldSemester.id === semester.id) {
          return {
            ...oldSemester,
            subjects: getNewFinishedSemestersSubjects(
              oldSemester,
              selectedSubjects,
              semesters,
              setError
            ),
          };
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
    const newSubjects = getNewNotFinishedSemesterSubjects(
      semester,
      selectedSubjects,
      semesters,
      setError
    );
    setSemesters((prevState) =>
      prevState.map((oldSemester) => {
        if (oldSemester.id === semester.id) {
          return { ...oldSemester, subjects: newSubjects };
        } else {
          return oldSemester;
        }
      })
    );
    setSelectedSubjects([]);
    setSelectAllSubjects(false);
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
            <div className="flex self-end flex-col items-end gap-2">
              <button
                className="px-1 underline underline-offset-4 hover:scale-[1.05] duration-300 w-fit"
                onClick={() => setSelectingSubjects((prevState) => !prevState)}
              >
                Selecionar
              </button>
              {selectingSubjects && (
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
              )}
            </div>

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
                        semester={semester}
                        selecting={selectingSubjects}
                        selectedSubjects={selectedSubjects}
                      />
                    );
                  })}
                  <OptionalSubjectBox semester={semester}/>
              </div>
              {provided.placeholder}
            </div>
            {selectingSubjects && (
              <div className="self-end flex flex-col gap-1">
                <button
                  className="border-black border-b-[1px] px-1  hover:scale-[1.05] duration-300"
                  onClick={handleFinishAllSubjects}
                >
                  Marcar como concluido
                  {selectedSubjects.length <= 1 ? "" : "s"} (
                  {selectedSubjects.length})
                </button>
                <button
                  className="border-black border-b-[1px] px-1  hover:scale-[1.05] duration-300"
                  onClick={handleNotFinishedSubjects}
                >
                  Marcar não como concluido
                  {selectedSubjects.length <= 1 ? "" : "s"} (
                  {selectedSubjects.length})
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
