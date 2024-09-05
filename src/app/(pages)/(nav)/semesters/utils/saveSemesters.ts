import { SemesterUserType } from "@/types/semester";
import { Dispatch, SetStateAction } from "react";
import { SemesterMessageType } from "../page";

const handleSaveSemester = async (
  userId: string,
  semesters: SemesterUserType[],
  setSemesters: Dispatch<SetStateAction<SemesterUserType[]>>,
  setSemesterMessage: Dispatch<SetStateAction<SemesterMessageType>>
) => {
  const requestBody = semesters.map((semester) => {
    return {
      id: semester.id,
      semester: semester.semester,
      subjects: semester.subjects.map((subject) => {
        return {
          id: subject.id,
          subjectId: subject.subject.id,
          teacherId: subject.teacher.id,
          finished: subject.finished,
        };
      }),
    };
  });
  try {
    const response = await fetch(`/api/saveSemester?id=${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ semesters: requestBody }),
    });
    if (!response.ok) {
      throw new Error();
    }
    const data: SemesterUserType[] = await response.json();
    setSemesters(data.sort((a, b) => a.semester - b.semester));
    setSemesterMessage({
      error: false,
      message: "Semestres salvo com sucesso",
    });
  } catch (e) {
    setSemesterMessage({
      error: true,
      message: "Error ao salvar semestre",
    });
  }
};

export default handleSaveSemester;
