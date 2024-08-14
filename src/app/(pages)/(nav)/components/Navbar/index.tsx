"use client";
import { UserContext } from "@/app/context/UserContext";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { FaGraduationCap } from "react-icons/fa";
import { HiBookOpen, HiHome } from "react-icons/hi2";

const Navbar = () => {
  const path = usePathname();
  const { user } = useContext(UserContext);

  return (
    <nav className="bg-white w-full flex items-center gap-[5%] px-5 py-2 relative">
      <Link
        href={"/"}
        className="bg-clip-text text-transparent bg-blueGradiant text-[2.5em]"
      >
        GestorTI
      </Link>
      <div className="flex gap-5 text-[1.5em]">
        <div
          className={`${
            path == "/" && "underline "
          } underline-offset-4 hover:scale-[1.05] duration-300 flex items-center gap-1`}
        >
          <HiHome />
          <Link href={"/"}>Início</Link>
        </div>
        <div
          className={`${
            path == "/subjects" && "underline "
          }  underline-offset-4 hover:scale-[1.05] duration-300 flex items-center gap-1`}
        >
          <HiBookOpen />
          <Link href={"/subjects"}>Matérias</Link>
        </div>
        <div
          className={`${
            path == "/semesters" && "underline "
          }  underline-offset-4 hover:scale-[1.05] duration-300 flex items-center gap-1`}
        >
          <FaGraduationCap />
          <Link href={"/semesters"}>Semestres</Link>
        </div>
      </div>
      {user && (
        <div className="absolute right-5 flex flex-col items-center">
          <Image
            src={user?.image_url || "/images/icons/user_profile.svg"}
            alt="Foto de perfil"
            width={50}
            height={50}
            className="rounded-full"
          />
          <span className="text-black">{user?.name}</span>
        </div>
      )}
      {!user && (
        <div className="absolute right-5 hover:scale-[1.05] duration-300">
          <Link href="/auth/login">Entrar</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
