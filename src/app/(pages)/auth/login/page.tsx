"use client";
import TextInput from "@/app/components/TextInput";
import {
  loginRequestSchema,
  loginRequestType,
} from "@/schemas/loginRequestSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { MdEmail, MdLock } from "react-icons/md";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginRequestType>({
    resolver: zodResolver(loginRequestSchema),
  });

  const onSubmit = async (data: loginRequestType) => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
  };

  return (
    <section className="w-full h-screen flex flex-col xl:flex-row gap-0">
      <div className="hidden xl:block w-1/2 h-full relative">
        <Image
          src="/images/bg/login_bg_image.svg"
          alt="Login background"
          fill
          className="object-cover"
        />
      </div>
      <div className="bg-blueGradiant flex-1 xl:w-1/2 xl:h-full p-4 flex flex-col items-center justify-center relative">
        <h1 className="font-vt text-white text-[2em] md:text-[4em] 2xl:text-[5em] text-center mb-[0.5em]">
          Bem vindo ao GestorTI!
        </h1>
        <div className="flex flex-col gap-2 items-center w-3/4 xl:w-1/2 ">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5 items-center"
          >
            <TextInput
              placeholder="Email"
              icon={MdEmail}
              className="bg-white w-full"
              registerType="email"
              register={register}
            />
            {errors.email && <span>{errors.email.message}</span>}
            <TextInput
              placeholder="Senha"
              icon={MdLock}
              className="bg-white w-full"
              type="password"
              registerType="password"
              register={register}
            />
            {errors.password && <span>{errors.password.message}</span>}

            <button
              type="submit"
              className="w-2/5 bg-white text-[1em] rounded py-1 hover:scale-[1.05] duration-300 hover:bg-[#f1f1f1]"
            >
              Entrar
            </button>
          </form>
          <button className="flex items-center gap-4 mt-3 w-fit bg-white text-[1em] rounded p-2 hover:scale-[1.05] duration-300 hover:bg-[#f1f1f1]">
            <div className="relative w-[25px] h-[25px]">
              <Image src="/images/icons/google.svg" alt="Google" fill />
            </div>
            Continuar com google
          </button>
        </div>
        <div className="text-white  text-[1em] flex gap-1 absolute bottom-5 right-5">
          <span>Não tem conta ainda?</span>
          <Link
            href={"/auth/register"}
            className=" underline-offset-4 hover:underline duration-300 "
          >
            Registre-se
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Login;
