import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

type Data = {
  user_data: {};
  access_token: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const session = await getServerSession(req, res, authOptions);
      const email = session?.user?.email;
      const response = await fetch(
        process.env.API_BASE_URL + `/auth/google/validate/${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        res
          .status(response.status)
          .json({ error: errorData || "Erro ao logar usuário" });
        return;
      }

      const data: Data = await response.json();
      res.setHeader(
        "Set-Cookie",
        `access_token=${data.access_token}; HttpOnly; Path=/; Max-Age=${
          60 * 60 * 24
        }; ${process.env.NODE_ENV === "production" ? "Secure;" : ""}`
      );
      res.status(response.status).json(data.user_data);
    } catch (error: any) {
      if (error.cause.code === "ECONNREFUSED") {
        res.status(500).json({ error: "Erro ao conectar com o servidor" });
      }
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
