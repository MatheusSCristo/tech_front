"use client";
import { UserContext } from "@/app/context/UserContext";
import { SubjectType } from "@/types/subject";
import { CircularProgress } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import Filter from "./components/Filter";
import SearchBar from "./components/SearchBar";
import Table from "./components/Table";


const Subjects = () => {
  const { user } = useContext(UserContext);
  const [subjects, setSubjects] = useState<SubjectType[]>([]);
  const [showSubjects, setShowSubjects] = useState<SubjectType[]>([]);
  const [searched, setSearched] = useState<string>("");
  const [filter, setFilter] = useState<Number>(0);

 
  useEffect(() => {
    const getSubjects = async () => {
      const response = await fetch("/api/getSubjects", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        setSubjects([]);
      }
      const data: SubjectType[] = await response.json();
      setSubjects(data);
    };
    getSubjects();
  }, []);

  const filterSubjects = (subjects: SubjectType[]) => {
  const mandatorySubjects=user?.structure.mandatory_subjects.map((subject)=>subject.id);

    return subjects.filter((subject) => {
      const nameMatches = subject.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes(
          searched
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
        ) || subject.id.toLowerCase().includes(searched.toLowerCase());

      switch (filter) {
        case 1:
          return (
            nameMatches && mandatorySubjects?.includes(subject.id)
          );
        case 2:
          return (
            nameMatches && !mandatorySubjects?.includes(subject.id)
          );
        case 3:
          return nameMatches && subject.ch === 30;
        case 4:
          return nameMatches && subject.ch === 60;
        case 5:
          return nameMatches && subject.ch === 90;
        default:
          return nameMatches;
      }
    });
  };
  useEffect(() => {
    setShowSubjects(filterSubjects(subjects));
  }, [filter, searched, subjects]);

  return (
    <section className="w-full h-screen bg-blueGradiant p-10">
      <div className="bg-[#ffffffae] w-full h-full rounded-xl flex flex-col items-center px-5 py-2 gap-5">
        <h1 className="text-[3em] leading-none">Matérias</h1>
        <div className="bg-white w-full p-2 rounded-md flex justify-between">
          <SearchBar searched={searched} setSearched={setSearched} />
          <Filter setFilter={setFilter} filter={filter}/>
        </div>
        <div className="w-full flex-1 overflow-x-hidden overflow-y-scroll  ">
          {showSubjects && <Table subjects={showSubjects} user={user} />}
          {showSubjects.length==0 && !searched && !filter && (
            <div  className="w-full h-full flex items-center justify-center">
              <CircularProgress />
            </div>
          )}
          {showSubjects.length==0 && (searched || filter!==0) && (
            <div  className="w-full h-full flex items-center justify-center">
              <span>Nenhum resultado encontrado...</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Subjects;
