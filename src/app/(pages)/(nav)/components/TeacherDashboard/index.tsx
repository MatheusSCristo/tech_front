"use client"

import { TeacherType } from "@/types/teacher";
import { Rating } from "@mui/material";
import { useEffect, useState } from "react";

const TeacherDashboard = () => {
  const [teacher,setTeachers]=useState<TeacherType[]>([]);

  useEffect(() => {
    const getTeachers = async () => {
      const response = await fetch("http://localhost:3000/api/teachers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        return;
      }
      const data:TeacherType[] = await response.json();
      setTeachers(data.sort((a,b)=>b.rating-a.rating));
    };
    getTeachers();
  },[])

  return (
    <div className="bg-[#ffffffd6] flex flex-col rounded-xl items-center px-10 pt-2 pb-4 h-[40%] gap-2">
      <h1 className="text-[2em]">TOP DOCENTES</h1>
      <div className="overflow-y-scroll w-full">
        {teacher.map((teacher) => (
          <Teacher teacher={teacher} />
        ))}
      </div>
    </div>
  );
};

export default TeacherDashboard;

const Teacher = ({teacher}:{teacher:TeacherType}) => {

  return(
    <div className="flex gap-2 h-[20%]">
      <span className="md:text-sm 2xl:text-[1.5em] truncate">{teacher.name}</span>
      <Rating name="rating" value={teacher.rating} readOnly precision={0.5} size="medium"  />
    </div>
  )
};
