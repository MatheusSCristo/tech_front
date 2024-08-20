"use client";
import SelectInput from "@/app/components/SelectInput";
import TextInput from "@/app/components/TextInput";
import { UserContext } from "@/app/context/UserContext";
import {
  googleRegisterRequestSchema,
  GoogleRegisterRequestType,
} from "@/schemas/googleRegisterRequestSchema";
import { UserType } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import CryptoJS from "crypto-js";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useForm, UseFormRegister } from "react-hook-form";
import { MdEmail, MdPerson } from "react-icons/md";

const getSemestersOptions = () => {
  const currentYear = new Date().getFullYear();
  const semester = Array.from(
    { length: 22 },
    (_, i) => currentYear - Math.floor(i / 2)
  ).map((year, i) => ({
    name: `${year}.${i % 2 ? 1 : 2}`,
    value: `${year}.${i % 2 ? 1 : 2}`,
  }));
  return semester;
};

const structureOptions = [
  { name: "Tecnologia da Informação - Matutino", value: 0 },
  { name: "Tecnologia da Informação - Noturno", value: 1 },
  { name: "Tecnologia da Informação - Engenharia de Software", value: 2 },
  { name: "Tecnologia da Informação - Ciências da Computação", value: 3 },
];

const textInputs = [
  { placeholder: "Nome completo", icon: MdPerson, registerType: "name" },
];

const decrypt = (text: string) => {
  const secret = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
  if (!secret) {
    return;
  }
  const bytes = CryptoJS.AES.decrypt(text, secret);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const Register = ({ params }: { params: { id: string } }) => {
  const { setUser } = useContext(UserContext);
  const [error, setError] = useState<String | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<GoogleRegisterRequestType>({
    resolver: zodResolver(googleRegisterRequestSchema),
  });

  useEffect(() => {
    if (params) {
      const decryptedEmail = decrypt(decodeURIComponent(params.id));
      if (!decryptedEmail) {
        router.push("/auth/login");
        return;
      }
      setEmail(decryptedEmail);
      setValue("email", decryptedEmail);
    }
  }, [params]);

 
  const onSubmit = async (data: GoogleRegisterRequestType) => {
    setError(null);
    
    const response = await fetch("/api/google/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({...data,email}),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error.message);
      return;
    }
    const result: UserType = await response.json();
    console.log(result);
    setUser(result);
    setTimeout(() => router.push("/"), 1000);
  };

  return (
    <section className="w-full h-screen flex flex-col xl:flex-row gap-0">
      <div className="bg-blueGradiant flex-1 xl:w-1/2 xl:h-full flex flex-col items-center relative">
        <h1 className="text-[2em] md:text-[4em] 2xl:text-[5em] text-white my-[1em]">
          Bem vindo ao GestorTI!
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-3/4 xl:w-1/2 flex flex-col justify-between flex-1 py-10"
        >
          <div className="flex flex-col gap-5">
            {textInputs.map((input) => (
              <div key={input.placeholder}>
                <TextInput
                  placeholder={input.placeholder}
                  icon={input.icon}
                  className="bg-white w-full"
                  registerType={input.registerType}
                  register={register}
                />
                {errors[input.registerType as keyof typeof errors] && (
                  <span className="text-[#ff6d6d]">
                    {errors[input.registerType as keyof typeof errors]?.message}
                  </span>
                )}
              </div>
            ))}
            <EmailInput register={register} />

            <div className="flex gap-5 flex-col xl:flex-row">
              <div>
                <SelectInput
                  placeholder="Semestre de início"
                  options={getSemestersOptions()}
                  id="semester"
                  register={register}
                  registerType="start_semester"
                />
                {errors.start_semester && (
                  <span className="text-[#ff6d6d]">
                    {errors.start_semester.message}
                  </span>
                )}
              </div>
              <div>
                <SelectInput
                  placeholder="Estrutura Curricular"
                  options={structureOptions}
                  id="estrutura"
                  register={register}
                  registerType="course"
                />
                {errors.course && (
                  <span className="text-[#ff6d6d]">
                    {errors.course.message}
                  </span>
                )}
              </div>
            </div>
            {error && (
              <span className="text-[#ff6d6d] text-center">{error}</span>
            )}
          </div>
          <button
            type="submit"
            className="bg-white rounded w-fit px-5 self-center mb-0 hover:scale-[1.05] duration-300 "
          >
            Criar conta
          </button>
        </form>
        <div className="flex gap-1 absolute bottom-3 left-3 text-white">
          <span>Já possui uma conta?</span>
          <Link
            href={"/auth/login"}
            className="underline-offset-4 hover:underline duration-300"
          >
            Faça login
          </Link>
        </div>
      </div>
      <div className="hidden xl:block w-1/2 h-full relative">
        <Image
          src="/images/bg/login_bg_image.svg"
          alt="Login background"
          fill
          className="object-cover"
          priority
        />
      </div>
    </section>
  );
};

export default Register;

const EmailInput = ({ register }: { register: UseFormRegister<any> }) => {
  return (
    <div
      className={` opacity-[50%] bg-white w-full flex gap-2 rounded shadow-2xl p-2 items-center`}
    >
      <MdEmail className="text-lightBlue" size={30} />
      <input
        placeholder="Email"
        className="bg-transparent border-none text-[1em] w-full focus:outline-none"
        {...register("email")}
        disabled
      />
    </div>
  );
};
