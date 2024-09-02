import { SemesterUserType } from "@/types/semester";
import { SemesterSubjectType } from "@/types/semesterSubject";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { useState } from "react";
import SubjectModal from "../SubjectModal";

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
      )}
    </Droppable>
  );
};

export default Semester;

const Subject = ({
  subject,
  index,
  setSemesters,
  semester,
  semesters
}: {
  subject: SemesterSubjectType;
  index: number;
  setSemesters: React.Dispatch<React.SetStateAction<SemesterUserType[]>>;
  semester:SemesterUserType;
  semesters:SemesterUserType[];
}) => {
  const [openSubjectPopUp, setOpenSubjectPopUp] = useState(false);

  return (
    <>
      <Draggable draggableId={subject.subject.id} index={index}>
        {(provided) => (
          <div
            onClick={() => setOpenSubjectPopUp(true)}
            onDrag={()=>setOpenSubjectPopUp(false)}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`${subject.finished ? "opacity-[50%]":"opacity-1"} overflow-hidden bg-mandatoryBlue border border-black h-[200px] w-[10%] flex items-center justify-center rounded p-3`} 
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
