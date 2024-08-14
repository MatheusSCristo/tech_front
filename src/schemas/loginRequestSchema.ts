import z from "zod";
export const loginRequestSchema = z.object({
  email: z
    .string()
    .email("Email inválido")
    .min(0, "É necessário informar o email do usuário"),
  password: z.string().min(0, "É necessário informar a senha do usuário"),
});

export type LoginRequestType = z.infer<typeof loginRequestSchema>;
