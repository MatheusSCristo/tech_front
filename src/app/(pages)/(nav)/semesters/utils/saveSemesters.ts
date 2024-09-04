import { SemesterContext } from "@/app/context/SemesterContext";
import { SemesterUserType } from "@/types/semester";
import { useContext } from "react";

const handleSaveSemester =async (userId: string, semesters: SemesterUserType[]) => {
    const {setSemesters}=useContext(SemesterContext);
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

  const response = await fetch(`/api/saveSemester?id=${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ semesters: requestBody }),
  });

  const data=await response.json();
  setSemesters(data);
};

export default handleSaveSemester;
