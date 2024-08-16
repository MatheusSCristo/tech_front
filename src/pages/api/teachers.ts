import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const cookies=req.headers.cookie;
    const access_token=cookies?.split("access_token=")[1].split(";")[0];
  if (req.method === "GET" && access_token) {
    try {
      const response = await fetchWithAuth(
        "http://localhost:8080/teacher",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
        access_token
      );
      if (!response.ok) {
        const errorData = await response.json();
        res
          .status(response.status)
          .json({ error: errorData || "Erro ao receber informações" });
        return;
      }
      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error: any) {
      res.status(500).json({ error: "Erro ao conectar com o servidor" });

      //   res.status(4s00).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
