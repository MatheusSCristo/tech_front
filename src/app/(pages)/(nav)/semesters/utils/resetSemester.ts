import { SemesterUserType } from "@/types/semester";
import { Dispatch, SetStateAction } from "react";
import { SemesterMessageType } from "../page";

const handleResetSemesters = async (
  userId: string,
  setSemesters: Dispatch<SetStateAction<SemesterUserType[]>>,
  setSemesterMessage: Dispatch<SetStateAction<SemesterMessageType>>
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
