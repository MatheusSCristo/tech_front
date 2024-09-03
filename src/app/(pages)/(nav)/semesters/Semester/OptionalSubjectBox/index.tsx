"use client";
import { SemesterUserType } from "@/types/semester";
import {
  useState
} from "react";
import { CiCirclePlus } from "react-icons/ci";
import OptionalSubjectsModal from "./OptionalSubjectsModal";


const OptionalSubjectBox = ({ semester }: { semester: SemesterUserType }) => {
  const [openSubjectPopUp, setOpenSubjectPopUp] = useState(false);
  return (
    <>
      <div
        onClick={() => setOpenSubjectPopUp(true)}
        className="flex flex-col h-[200px] relative w-[10vw] bg-[#ffffff8d] border-black border rounded flex items-center justify-center shadow-xl cursor-pointer hover:scale-[1.05] duration-300"
      >
        <CiCirclePlus className="text-" size={50} />
      </div>
      {openSubjectPopUp && (
        <OptionalSubjectsModal
          semester={semester}
          handleClose={() => setOpenSubjectPopUp(false)}
        />
      )}
    </>
  );
};

export default OptionalSubjectBox;




//ADICIONAR MATERIA OPTATIVA
//BACKEND ENDPOINT MATERIAS OPTATIVAS
//BACKEND ENCRYPT EMAIL ON GOOGLE LOGIN
