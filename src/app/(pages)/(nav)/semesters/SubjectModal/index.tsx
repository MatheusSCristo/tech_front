import { SemesterUserType } from "@/types/semester";
import { SemesterSubjectType } from "@/types/semesterSubject";
import { TeacherType } from "@/types/teacher";
import { useEffect, useState } from "react";

const SubjectModal = ({
  subject,
  handleClose,
  setSemesters,
  semester,
}: {
  subject: SemesterSubjectType;
  handleClose: () => void;
  setSemesters: React.Dispatch<React.SetStateAction<SemesterUserType[]>>;
  semester: SemesterUserType;
}) => {
  const [finished, setFinished] = useState(subject.finished);
  const [teachers, setTeachers] = useState<TeacherType[]>([]);
  const [teacherName, setTeacherName] = useState<string | undefined>(subject.teacher.name);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const teacher = teachers.find((teacher) => teacher.name === teacherName);
    if (teacher === undefined) {
      return;
    }
    const newSubject = {
      ...subject,
      finished: finished,
      teacher: teacher,
    };
    const newSemesterSubjects = semester.subjects.map((semesterSubject) =>
      semesterSubject.id === newSubject.id ? newSubject : semesterSubject
    );
    setSemesters((prevState) =>
      prevState.map((oldSemester) => {
        if (oldSemester.id === semester.id) {
          return { ...oldSemester, subjects: newSemesterSubjects };
        } else {
          return oldSemester;
        }
      })
    );
    handleClose();
  };

  useEffect(() => {
    const getTeachers = async () => {
      const response = await fetch("/api/teacher", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setTeachers(data);
      }
    };
    getTeachers();
  }, []);

  return (
    <section className="z-10 fixed top-0 left-0 bg-[#edededae] flex flex-col justify-center items-center w-full h-full">
      <div className="bg-white border border-black rounded relative w-[30%] flex flex-col items-center pb-5 pt-3 px-2 gap-3">
        <span
          className="absolute top-1 right-2 cursor-pointer"
          onClick={handleClose}
        >
          X
        </span>
        <h1 className="xl:text-[1em] 2xl:text-[1.5em] font-bold border-b-[1px] border-black w-full text-center">
          {subject.subject.name}
        </h1>
        <div className="flex flex-col gap-1 border-b-[1px] border-black">
          <h2 className="w-full">
            <strong>Código:</strong> {subject.subject.id}
          </h2>
          <h2 className="w-full">
            <strong>Carga horária:</strong> {subject.subject.ch}
          </h2>
          <h2 className="w-full">
            <strong>Descrição:</strong> {subject.subject.description}
          </h2>
          {subject.subject.pre_requisites.length > 0 && (
            <>
              <h2 className="w-full font-bold">Pré requisitos:</h2>
              <div className="flex flex-col w-full">
                {subject.subject.pre_requisites.map((prerequisite) => (
                  <h3 className="">
                    {prerequisite.id}-{prerequisite.name}
                  </h3>
                ))}
              </div>
            </>
          )}
          {subject.subject.co_requisites.length > 0 && (
            <>
              <h2 className="w-full font-bold">Co requisitos:</h2>
              <div className="flex flex-col w-full">
                {subject.subject.co_requisites.map((coRequisite) => (
                  <h3 className="">
                    {coRequisite.id}-{coRequisite.name}
                  </h3>
                ))}
              </div>
            </>
          )}
        </div>
        <form className="w-full flex flex-col gap-2" onSubmit={handleSave}>
          <div className="flex gap-3">
            <h2 className="font-bold">Componente concluido?</h2>
            <input
              type="checkbox"
              name="concluded"
              id="concluded"
              checked={finished}
              onChange={() => {
                setFinished(!finished);
              }}
            />
          </div>
          <div className="flex gap-3">
            <h2 className="font-bold">Professor:</h2>
            <select
              className="border border-black w-full rounded"
              value={teacherName || ""}
              onChange={(e) => setTeacherName(e.target.value)}
            >
              {teachers.map((teacher) => (
                <option className="truncate">
                  {teacher.name === "Padrão" ? "Não informar" : teacher.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="border border-black shadow-xl px-3 py-1 w-fit rounded self-center"
          >
            Salvar informações
          </button>
        </form>
      </div>
    </section>
  );
};

export default SubjectModal;
