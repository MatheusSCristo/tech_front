import { SemesterUserType } from "@/types/semester";
import { Droppable, Draggable } from "@hello-pangea/dnd";

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

  
export default Semester;