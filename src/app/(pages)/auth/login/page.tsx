"use client";
import TextInput from "@/app/components/TextInput";
import { UserContext } from "@/app/context/UserContext";
import {
  loginRequestSchema,
  LoginRequestType,
} from "@/schemas/loginRequestSchema";
import { UserType } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { MdEmail, MdLock } from "react-icons/md";

const Login = () => {
  const { setUser } = useContext(UserContext);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequestType>({
    resolver: zodResolver(loginRequestSchema),
  });

  const onSubmit = async (data: LoginRequestType) => {
    setError(null);
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      setError(
        response.status == 500
          ? "Erro ao conectar com o servidor"
          : "Erro na validação das credenciais, tente novamente."
      );
      return;
    }
    const result: UserType = await response.json();
    setUser(result);
    setTimeout(() => router.push("/"), 1000);
  };

  //GOOGLE LOGIN TO-DO

  return (
    <section className="w-full h-screen flex flex-col xl:flex-row gap-0">
      <div className="hidden xl:block w-1/2 h-full relative">
        <Image
          src="/images/bg/login_bg_image.svg"
          alt="Login background"
          fill
          className="object-cover"
          priority
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
            <div className="flex flex-col items-center w-full">
              <TextInput
                placeholder="Email"
                icon={MdEmail}
                className="bg-white w-full"
                registerType="email"
                register={register}
              />
              {errors.email && (
                <span className="text-[#ff6d6d] ">{errors.email.message}</span>
              )}
            </div>
            <div className="flex flex-col items-center w-full">
              <TextInput
                placeholder="Senha"
                icon={MdLock}
                className="bg-white w-full"
                type="password"
                registerType="password"
                register={register}
              />
              {errors.password && (
                <span className="text-[#ff6d6d] ">
                  {errors.password.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-2/5 bg-white text-[1em] rounded py-1 hover:scale-[1.05] duration-300 hover:bg-[#f1f1f1]"
            >
              Entrar
            </button>
          </form>
          <button
            onClick={() => signIn("google")}
            className="flex items-center gap-4 mt-3 w-fit bg-white text-[1em] rounded p-2 hover:scale-[1.05] duration-300 hover:bg-[#f1f1f1]"
          >
            <div className="relative w-[25px] h-[25px]">
              <Image src="/images/icons/google.svg" alt="Google" fill />
            </div>
            Continuar com google
          </button>

          {error && <span className="text-[#ff6d6d] ">{error}</span>}
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
