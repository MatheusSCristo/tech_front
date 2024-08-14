"use client";
import { UserContext } from "@/app/context/UserContext";
import { LinearProgress } from "@mui/material";
import Image from "next/image";
import { useContext } from "react";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  return (
    <div className="bg-[#ffffffd6] flex flex-col rounded-xl items-center px-10 pt-5 pb-10">
      <h1 className="text-[2em]">Dashboard</h1>
      <div className="flex gap-2">
        <div className="relative w-[80px] h-[80px]">
          <Image
            src={user?.image_url || "/images/icons/user_profile.svg"}
            alt="User image"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col">
          <h1 className="capitalize text-[1.2em] font-bold">{user?.name}</h1>
          <h2 className="capitalize text-[0.8em]">
            Tecnologia da Informação 2024.1
          </h2>
          <h3 className="capitalize text-[0.8em]">{user?.structure.name}</h3>
        </div>
      </div>
      <div className="flex flex-col gap-3 w-full mt-3">
        <div className="w-full ">
          <h3>
            Matérias obrigátorias:35/{user?.structure.mandatory_subjects.length}
          </h3>
          <LinearProgress variant="determinate" value={50} />
        </div>
        <div className="w-full ">
          <h3>
            Matérias obrigátorias:35/{user?.structure.mandatory_subjects.length}
          </h3>
          <LinearProgress variant="determinate" value={50} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
