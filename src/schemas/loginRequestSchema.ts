import z from "zod";
export const loginRequestSchema = z.object({
  email: z
    .string()
    .min(1, "É necessário informar o email do usuário")
    .email("Email inválido"),
  password: z.string().min(1, "É necessário informar a senha do usuário"),
});

export type LoginRequestType = z.infer<typeof loginRequestSchema>;
