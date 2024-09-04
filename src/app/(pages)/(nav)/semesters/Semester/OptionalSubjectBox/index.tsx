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
        className="flex flex-col h-[250px] relative cursor-pointer hover:scale-[1.05] duration-300"
      >
        <div className="m-5 h-[200px] w-[10vw] bg-[#ffffff8d] flex items-center justify-center border-black border rounded  shadow-xl">
        <CiCirclePlus className="text-" size={50} />
        </div>
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

