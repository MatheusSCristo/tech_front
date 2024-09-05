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
          process.env.API_BASE_URL + "/subject",
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
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
