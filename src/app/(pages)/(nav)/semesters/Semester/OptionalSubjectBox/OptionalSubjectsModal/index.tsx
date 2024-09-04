import SearchBar from "@/app/(pages)/(nav)/subjects/components/SearchBar";
import { SemesterContext } from "@/app/context/SemesterContext";
import { UserContext } from "@/app/context/UserContext";
import { SemesterUserType } from "@/types/semester";
import { SubjectType } from "@/types/subject";
import { CircularProgress } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import Table from "./Table";

const OptionalSubjectsModal = ({
    semester,
    handleClose,
  }: {
    semester: SemesterUserType;
    handleClose: () => void;
  }) => {
    const { semesters, setSemesters } = useContext(SemesterContext);
    const [searched, setSearched] = useState("");
    const [optionalsSubjects, setOptionalsSubjects] = useState<SubjectType[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(UserContext);
    const [selectedSubjects, setSelectedSubjects] = useState<SubjectType[]>([]);
    const [showSubjects, setShowSubjects] = useState<SubjectType[]>([]);
  
    useEffect(() => {
      const getSubjects = async () => {
        setLoading(true);
        if (user) {
          try {
            const response = await fetch(
              `/api/getOptionalSubjects?id=${user?.structure.id}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
              }
            );
            if (!response.ok) {
              throw new Error("Erro ao buscar componentes");
            }
            const data = await response.json();
            const filteredData = data.filter((subject: SubjectType) =>
              checkSubjectIsAvailable(subject)
            );
            setOptionalsSubjects(filteredData);
            setShowSubjects(filteredData);
            return;
          } catch (err) {
            console.log(err);
          } finally {
            setLoading(false);
          }
        }
      };
      getSubjects();
    }, [user]);
  
    useEffect(() => {
      setShowSubjects(
        optionalsSubjects.filter((subject: SubjectType) => {
          const nameMatches =
            subject.name
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .includes(
                searched
                  .toLowerCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
              ) || subject.id.toLowerCase().includes(searched.toLowerCase());
          return nameMatches;
        })
      );
    }, [searched]);
  
    const checkSubjectIsAvailable = (subject: SubjectType) => {
      const semesterSubjects = semesters.flatMap(
        (actualSemester) => actualSemester.subjects
      );
      const semesterSubjectsFinished = semesters
        .filter((actualSemester) => actualSemester.semester < semester.semester)
        .flatMap((actualSemester) => actualSemester.subjects)
        .filter((subject) => subject.finished)
        .flatMap((subject) => subject.subject);
      const subjectPrerequisites = subject.pre_requisites;
      if (
        semesterSubjects.some(
          (semesterSubject) => semesterSubject.subject.id === subject.id
        )
      ) {
        return false;
      }
      if (subjectPrerequisites.length === 0) {
        return true;
      }
      const isAvailable = subjectPrerequisites.every((prerequisite) =>
        semesterSubjectsFinished.some((subject) => subject.id === prerequisite.id)
      );
      return isAvailable;
    };
  
    const handleAddSubjects = () => {
      const newSemesters = semesters.map((actualSemester) => {
        if (actualSemester.semester === semester.semester) {
          return {
            ...actualSemester,
            subjects: [
              ...actualSemester.subjects,
              ...selectedSubjects.map((subject) => ({
                id: subject.id,
                teacher: { id: "0", name: "Padrão", rating: [0] }, 
                subject,
                finished: false,
              })),
            ],
          };
        }
        return actualSemester;
      });
  
      setSemesters(newSemesters);
      handleClose();
    };
  
    return (
      <div className="bg-[#c5c5c5d1] z-10 fixed top-0 left-0 h-screen w-screen flex items-center justify-center ">
        <div className="relative bg-white border border-black w-[80%] h-[60%] rounded py-5 px-2 flex flex-col items-center gap-2">
          <button
            className="absolute right-5 top-5 text-lg"
            onClick={handleClose}
          >
            X
          </button>
          <h1 className="text-center text-2xl">Matérias Optativas</h1>
          <SearchBar searched={searched} setSearched={setSearched} size="w-4/5" />
          <div className="overflow-y-scroll w-full">
            {showSubjects.length == 0 && loading && (
              <div className="w-full h-full flex items-center justify-center">
                <CircularProgress size={30} />
              </div>
            )}
            {showSubjects.length > 0 && !loading && (
              <Table
                subjects={showSubjects}
                selectedSubjects={selectedSubjects}
                setSelectedSubjects={setSelectedSubjects}

              />
            )}
            {showSubjects.length === 0 && !loading && (
              <div className="flex flex-col justify-center items-center h-full">
                <h1>
                  Nenhuma matéria optativa disponível foi encontrada para o
                  semestre atual.
                </h1>
              </div>
            )}
          </div>
          {showSubjects.length > 0 && (
            <div className="flex items-end">
              <button
                className="border-b border-black hover:scale-[1.05] duration-300 disabled:opacity-[50%]"
                disabled={!selectedSubjects.length}
                onClick={handleAddSubjects}
              >
                Adicionar componente{selectedSubjects.length > 1 && "s"}(
                {selectedSubjects.length})
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

export default OptionalSubjectsModal;