import { SemesterContext } from "@/app/context/SemesterContext";
import { UserContext } from "@/app/context/UserContext";
import { SemesterUserType } from "@/types/semester";
import { SemesterSubjectType } from "@/types/semesterSubject";
import { Draggable } from "@hello-pangea/dnd";
import { useContext, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import SubjectModal from "../../SubjectModal";
import DeleteModal from "./modal/DeleteModal";

const Subject = ({
  subject,
  index,
  semester,
  setSelectedSubjects,
  selecting,
  selectedSubjects,
}: {
  subject: SemesterSubjectType;
  index: number;
  semester: SemesterUserType;
  selectedSubjects: SemesterSubjectType[];
  setSelectedSubjects: React.Dispatch<
    React.SetStateAction<SemesterSubjectType[]>
  >;
  selecting: boolean;
}) => {
  const [openSubjectPopUp, setOpenSubjectPopUp] = useState(false);
  const [checked, setChecked] = useState(false);
  const {setSemesters} = useContext(SemesterContext)
  const { user } = useContext(UserContext);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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


  const handleDelete=()=>{
    const newSubjets=semester.subjects.filter((item)=>item.id!==subject.id)
    setSemesters((prevState)=>{
      return prevState.map((item)=>{
        if(item.id===semester.id){
          return {...item,subjects:newSubjets}
        }
        return item;
      })
    })
    setDeleteModalOpen(false)
  }


  const isMandatory = user?.structure.mandatory_subjects.some(
    (item) => item.id === subject.subject.id
  );

  return (
    <>
   {deleteModalOpen && <DeleteModal handleDelete={handleDelete} subject={subject} handleClose={()=>setDeleteModalOpen(false)}/>}
      <Draggable draggableId={subject.subject.id} index={index}>
        {(provided) => (
          <div className="flex flex-col h-[250px] relative ">
            {!isMandatory && 
            <div className="absolute right-0 top-0 text-red-500 cursor-pointer z-10" onClick={()=>setDeleteModalOpen(true)}>
              <IoClose size={30} />
              </div>}
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
              }  overflow-hidden ${
                isMandatory ? "bg-mandatoryBlue" : "bg-optionalGray"
              }  border border-black h-[200px] w-[10vw] flex items-center justify-center rounded p-3 shadow-xl m-5 hover:scale-[1.05] duration-300
                ${checked ? "shadow-[#2587e265]" : ""} 
                `}
            >
              <span className="text-center text-wrap truncate uppercase">
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
          semester={semester}
        />
      )}
    </>
  );
};

export default Subject;
