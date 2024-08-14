import z from "zod";
export const registerRequestSchema = z
  .object({
    email: z.string().email("Email inválido").min(1, "É necessário informar o email do usuário"),
    password: z.string().min(6, "É necessário informar a senha do usuário"),
    confirmPassword: z.string().min(6, "É necessário confirmar a senha do usuário"),
    name: z.string().min(1, "É necessário confirmar o nome do usuário"),
    start_semester: z
      .string()
      .min(1, "É necessário informar o semestre de início do usuário"),
    course: z
      .string()
      .min(1, "É necessário informar o curso do usuário")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path:["confirmPassword"],
  });

export type RegisterRequestType = z.infer<typeof registerRequestSchema>;
