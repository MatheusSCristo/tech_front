import { NextApiRequest, NextApiResponse } from "next";

type Data = {
  user_data: {};
  access_token: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const body = {
      name: req.body.name,
      email: req.body.email,
      image_url: "",
      start: req.body.start_semester,
      structure_id: req.body.course,
    };
    try {
      const response = await fetch(
        `http://localhost:8080/auth/google/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        res
          .status(response.status)
          .json({ error: errorData || "Erro ao registrar usuário" });
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
