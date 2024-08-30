import { SemesterUserType } from "@/types/semester";
import { SemesterSubjectType } from "@/types/semesterSubject";

export const handleSwapSubjects = (
    semesters: SemesterUserType[],
    subject: SemesterSubjectType,
    semesterId: string
  ) => {
    const semesterSubjectDraggedFrom = semesters?.findIndex((item) =>
      item.subjects.some((item) => item.subject.id == subject.subject.id)
    );

    const droppedSemester = semesters?.findIndex(
      (item) => item.id == semesterId
    );
    const removedSubjectFromDraggedSemester = semesters[
      semesterSubjectDraggedFrom
    ].subjects.filter((item) => item != subject);
    const addedSubjectToDroppedSemester = [
      ...semesters[droppedSemester].subjects,
      subject,
    ];

    const updatedSemester = [...semesters];

    updatedSemester[semesterSubjectDraggedFrom] = {
      ...updatedSemester[semesterSubjectDraggedFrom],
      subjects: removedSubjectFromDraggedSemester,
    };

    updatedSemester[droppedSemester] = {
      ...updatedSemester[droppedSemester],
      subjects: addedSubjectToDroppedSemester,
    };

    return updatedSemester;
  };