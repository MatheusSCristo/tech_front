import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const cookies=req.cookies;
    const accessToken = cookies.access_token;

    try {
      if (accessToken) {
        const response = await fetchWithAuth(
          "http://localhost:8080/subject",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
          accessToken
        );
        if (!response.ok) {
          const errorData = await response.json();
          res
            .status(response.status)
            .json({ error: errorData || "Erro ao buscar componentes" });
          return;
        }
        
        const data= await response.json();
        res.status(response.status).json(data);
    }
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
