"use client";
import { UserContext } from "@/app/context/UserContext";
import { SubjectType } from "@/types/subject";
import { LinearProgress } from "@mui/material";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [subjects, setSubjects] = useState<SubjectType[]>([]);
  const mandatorySubjectsFinished = user?.semesters
    .flatMap((semester) => semester.subjects)
    .filter(
      (subject) =>
        subject.finished &&
        user.structure.mandatory_subjects.some(
          (mandatorySubject) => mandatorySubject.id == subject.subject.id
        )
    );

  const mandatorySubjects =  Array.from(
    new Set(user?.structure.mandatory_subjects.map((subject) => JSON.stringify(subject)))).map((str) => JSON.parse(str));

  const optionalSubjectsFinished = user?.semesters
    .flatMap((semester) => semester.subjects)
    .filter(
      (subject) =>
        subject.finished &&
        user.structure.mandatory_subjects.every(
          (optionalSubject) => optionalSubject.id != subject.subject.id
        )
    ).reduce((acc,subject)=>acc+subject.subject.ch,0)


  

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
        return;
      }
      const data: SubjectType[] = await response.json();
      setSubjects(data);
    };
    getSubjects();
  }, []);

  return (
    <div className="bg-[#ffffffd6] flex flex-col rounded-xl items-center px-3 pt-5 pb-10">
      <h1 className="text-[2em]">Dashboard</h1>
      <div className="flex gap-2 w-full">
        <div className="relative w-[60px] h-[60px] ">
          <Image
            src={user?.image_url || "/images/icons/user_profile.svg"}
            alt="User image"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          <h1 className="capitalize text-[1.2em] font-bold text-truncate ">
            {user?.name || "..."}
          </h1>
          <h2 className="capitalize text-[0.8em]">
            Tecnologia da Informação 2024.1
          </h2>
          <h3 className="capitalize text-[0.8em]">
            {user?.structure.name || "..."}
          </h3>
        </div>
      </div>
      <div className="flex flex-col gap-3 w-full mt-3">
        {user && (
          <div className="w-full ">
            <h3>
              Matérias obrigátorias: {mandatorySubjectsFinished?.length}/
              {mandatorySubjects.length}
            </h3>
            <LinearProgress
              variant="determinate"
              value={
                mandatorySubjectsFinished?.length ||
                0 / mandatorySubjects.length
              }
            />
          </div>
        )}

        {user && (
          <div className="w-full">
            <h3>
              Carga Horária Optativa: {optionalSubjectsFinished}/{user.structure.optional_ch_min}h
            </h3>
            <LinearProgress
              variant="determinate"
              value={(optionalSubjectsFinished || 0) / user.structure.optional_ch_min * 100}
              
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
