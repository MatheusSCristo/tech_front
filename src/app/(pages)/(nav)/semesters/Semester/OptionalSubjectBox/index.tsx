"use client";
import { SemesterContext } from "@/app/context/SemesterContext";
import { UserContext } from "@/app/context/UserContext";
import { SemesterUserType } from "@/types/semester";
import { SubjectType } from "@/types/subject";
import { CircularProgress } from "@mui/material";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { CiCirclePlus } from "react-icons/ci";
import { v4 as uuidv4 } from "uuid";
import SearchBar from "../../../subjects/components/SearchBar";

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
              id: uuidv4() as string,
              teacher: { id: "0", name: "Padrão", rating: 5 } ,
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

const Table = ({
  subjects,
  setSelectedSubjects,
  selectedSubjects,
}: {
  subjects: SubjectType[];
  setSelectedSubjects: Dispatch<SetStateAction<SubjectType[]>>;
  selectedSubjects: SubjectType[];
}) => {
  return (
    <table className="w-full">
      <thead className="my-5">
        <tr className="py-2 overflow-hidden">
          <th className="text-nowrap"></th>
          <th className="text-nowrap">Código</th>
          <th className="text-nowrap w-1/5">Componente</th>
          <th className="text-nowrap">Carga Horária</th>
          <th className="text-nowrap w-2/5">Descrição</th>
        </tr>
      </thead>
      <tbody>
        {subjects.map((subject) => (
          <TableRows
            subject={subject}
            setSelectedSubjects={setSelectedSubjects}
            selectedSubjects={selectedSubjects}
          />
        ))}
      </tbody>
    </table>
  );
};

const TableRows = ({
  subject,
  setSelectedSubjects,
  selectedSubjects,
}: {
  subject: SubjectType;
  setSelectedSubjects: Dispatch<SetStateAction<SubjectType[]>>;
  selectedSubjects: SubjectType[];
}) => {
  const [checked, setChecked] = useState(false);

  const handleSelect = () => {
    setChecked(!checked);
    setSelectedSubjects((prevState) =>
      prevState.includes(subject)
        ? prevState.filter((item) => item !== subject)
        : [...prevState, subject]
    );
  };

  useEffect(() => {
    if (selectedSubjects.includes(subject)) setChecked(true);
    else setChecked(false);
  }, [selectedSubjects]);

  return (
    <tr
      key={subject.id}
      className="border-b-[1px] border-black h-[50px] my-2 w-full "
      onClick={handleSelect}
    >
      <td>
        <input type="checkbox" checked={checked} readOnly />
      </td>
      <td className="text-[#575757] truncate max-w-[100px] text-center">
        {subject.id}
      </td>
      <td
        className="text-[#575757] truncate max-w-[100px] overflow-hidden text-ellipsis"
        title={subject.name}
      >
        {subject.name}
      </td>

      <td className="text-center text-[#575757]">{subject.ch}h</td>
      <td
        className="text-[#575757] truncate max-w-[100px] overflow-hidden text-ellipsis"
        title={subject.description}
      >
        {subject.description || "Descrição não cadastrada."}
      </td>
    </tr>
  );
};

//ADICIONAR MATERIA OPTATIVA
//BACKEND ENDPOINT MATERIAS OPTATIVAS
//BACKEND ENCRYPT EMAIL ON GOOGLE LOGIN
