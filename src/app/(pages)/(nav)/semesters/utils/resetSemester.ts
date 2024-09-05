import { SemesterUserType } from "@/types/semester";
import { UserType } from "@/types/user";
import { Dispatch, SetStateAction } from "react";
import { SemesterMessageType } from "../page";

const handleResetSemesters = async (
  userId: string,
  setSemesters: Dispatch<SetStateAction<SemesterUserType[]>>,
  setSemesterMessage: Dispatch<SetStateAction<SemesterMessageType>>,
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>

) => {
  try {
    const response = await fetch(`/api/resetSemesters?id=${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if(!response.ok){
      throw new Error;
    }
    const data: SemesterUserType[] = await response.json();
    setSemesters(data.sort((a, b) => a.semester - b.semester));
    setUser((prev)=>({...prev,semesters:data} as UserType))
    setSemesterMessage({
      error: false,
      message: "Semestres resetados com sucesso",
    });
  } catch (e) {
    setSemesterMessage({
      error: true,
      message: "Error ao resetar semestres",
    });
  }
};

export default handleResetSemesters;
