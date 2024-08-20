import z from "zod";
export const googleRegisterRequestSchema = z
  .object({
    name: z.string().min(1, "É necessário informar o nome do usuário"),
    email:z.string().email("É necessário informar um e-mail válido"),
    start_semester: z
      .string()
      .min(1, "É necessário informar o semestre de início do usuário"),
    course: z
      .string()
      .min(1, "É necessário informar o curso do usuário")
  })

export type GoogleRegisterRequestType = z.infer<typeof googleRegisterRequestSchema>;
