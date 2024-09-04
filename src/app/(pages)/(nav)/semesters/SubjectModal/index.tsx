import { SemesterContext } from "@/app/context/SemesterContext";
import { SemesterUserType } from "@/types/semester";
import { SemesterSubjectType } from "@/types/semesterSubject";
import { TeacherType } from "@/types/teacher";
import { Rating } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import ErrorPopUp from "../ErrorPopUp";

type PreRequisiteErrorType = {
  text: string;
  status: boolean;
  option?: string;
  responseFunction?: () => void;
};

const SubjectModal = ({
  subject,
  handleClose,
  semester,
}: {
  subject: SemesterSubjectType;
  handleClose: () => void;
  semester: SemesterUserType;
}) => {
  const { setSemesters, semesters } = useContext(SemesterContext);
  const [finished, setFinished] = useState(subject.finished);
  const [teachers, setTeachers] = useState<TeacherType[]>([]);
  const [teacherName, setTeacherName] = useState<string | undefined>(
    subject.teacher.name
  );
  const [preRequisiteError, setPreRequisiteError] =
    useState<PreRequisiteErrorType>({} as PreRequisiteErrorType);

  const [ratingValue,setRatingValue] = useState<number>(subject.teacher.rating.reduce((acc,cur)=>acc+cur,0)/subject.teacher.rating.length);
  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const teacher = teachers.find((teacher) => teacher.name === teacherName);
    if (teacher === undefined) {
      return;
    }
    const newSubject = {
      ...subject,
      finished: finished,
      teacher: {...teacher,rating:[...teacher.rating,ratingValue]},
    };
    const newSemesterSubjects = semester.subjects.map((semesterSubject) =>
      semesterSubject.id === newSubject.id ? newSubject : semesterSubject
    );
    if (!checkIfPreRequisitesAreFinished() && finished) return;

    if (!finished)
      if (!checkIfOtherSubjectsThatHaveThisSubjectAsPreRequisiteAreFinished())
        return;

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

  const checkIfPreRequisitesAreFinished = () => {
    const preRequisites = subject.subject.pre_requisites;
    const preRequisitesNotFinished = preRequisites.filter((prerequisite) =>
      semesters.some((semester) =>
        semester.subjects.some(
          (semesterSubject) =>
            semesterSubject.subject.id === prerequisite.id &&
            !semesterSubject.finished
        )
      )
    );
    if (preRequisitesNotFinished.length > 0) {
      setPreRequisiteError({
        text: `Não é possível finalizar ${subject.subject.name} pois ${preRequisitesNotFinished[0].name} é pre requisito e ainda não foi concluido.`,
        status: true,
      });
      setFinished(false);
    }

    return preRequisitesNotFinished.length === 0;
  };

  const checkIfOtherSubjectsThatHaveThisSubjectAsPreRequisiteAreFinished =
    () => {
      const otherSubjects = semesters.flatMap((semester) => semester.subjects);
      const otherSubjectsThatHaveThisSubjectAsPreRequisiteFinished =
        otherSubjects.filter((semesterSubject) =>
          semesterSubject.subject.pre_requisites.some(
            (prerequisite) =>
              prerequisite.id === subject.subject.id && semesterSubject.finished
          )
        );
      if (otherSubjectsThatHaveThisSubjectAsPreRequisiteFinished.length === 0)
        return true;

      const responseFuntion = () => {
        let newSemesters = semesters;
        otherSubjectsThatHaveThisSubjectAsPreRequisiteFinished
          .concat(subject)
          .forEach((subject) => {
            const newSubject = {
              ...subject,
              finished: false,
              teacher:{...subject.teacher,rating:subject.teacher.rating.slice(0,-1)}
            };
            newSemesters = newSemesters.map((semester) => {
              return {
                ...semester,
                subjects: semester.subjects.map((semesterSubject) => {
                  return semesterSubject.id === newSubject.id
                    ? newSubject
                    : semesterSubject;
                }),
              };
            });
          });
        setSemesters(newSemesters);
        handleClose();
        setPreRequisiteError({} as PreRequisiteErrorType);
      };
      setPreRequisiteError({
        text: `Existem matérias concluidas que possuem ${subject.subject.name} como pré requisito,para desmarcar esta matéria é necessário marcas-las como não concluidas.`,
        status: true,
        option: "Deseja continuar?",
        responseFunction: responseFuntion,
      });
      return false;
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
    <>
      <section className="z-10 fixed top-0 left-0 bg-[#edededae] flex flex-col justify-center items-center w-full h-full">
        <div className="bg-white border border-black rounded relative w-[30%] flex flex-col  pb-5 pt-3 px-2 gap-3">
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
              <strong>Descrição:</strong> {subject.subject.description || "Sem descrição"}
            </h2>
            {subject.subject.pre_requisites.length > 0 && (
              <>
                <h2 className="w-full font-bold">Pré requisitos:</h2>
                <div className="flex flex-col w-full">
                  {subject.subject.pre_requisites.map((prerequisite) => (
                    <h3 className="" key={prerequisite.id}>
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
                    <h3 className="" key={coRequisite.id}>
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
                  <option className="truncate" key={teacher.id}>
                    {teacher.name === "Padrão" ? "Não informar" : teacher.name}
                  </option>
                ))}
              </select>
            </div>
           {finished && <div className="flex gap-3">
              <h2>Avaliar professor:</h2>
              <Rating name="rating" defaultValue={0} value={ratingValue} onChange={(e,newValue)=>{setRatingValue(newValue || 0)}}/>

            </div>}
            <button
              type="submit"
              className="border border-black shadow-xl px-3 py-1 w-fit rounded self-center"
            >
              Salvar informações
            </button>
          </form>
        </div>
      </section>
      {preRequisiteError.status && (
        <ErrorPopUp
          error={preRequisiteError.text}
          option={preRequisiteError.option}
          responseFunction={preRequisiteError.responseFunction}
          handleClosePopUp={() => {
            handleClose();
            setPreRequisiteError({} as PreRequisiteErrorType);
          }}
        />
      )}
    </>
  );
};

export default SubjectModal;
