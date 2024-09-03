import { SemesterUserType } from "@/types/semester";
import { SemesterSubjectType } from "@/types/semesterSubject";
import { Draggable } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import SubjectModal from "../../SubjectModal";

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
                  className={` border-blue rounded h-full w-full absolute cursor-pointer z-10`}
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
                } m-2 overflow-hidden bg-mandatoryBlue border border-black h-[200px] w-[10vw] flex items-center justify-center rounded p-3 shadow-[#2587e265]
                ${checked?"shadow-xl":""} 
                `}
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

export default Subject;