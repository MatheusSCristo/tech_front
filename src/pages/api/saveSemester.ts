import { SemesterUserType } from "@/types/semester";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const cookies = req.cookies;
    const accessToken = cookies.access_token;
    const userId = req.query.id as string;
    const body: SemesterUserType[] = req.body;
    try {
      if (accessToken) {
        const response = await fetchWithAuth(
          `http://localhost:8080/semester_user/${userId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          },
          accessToken
        );

        if (!response.ok) {
          const errorData = await response.json();
          res
            .status(response.status)
            .json({ error: errorData || "Erro ao salvar semestres" });
          return;
        }
        const data = await response.json();
        res.status(response.status).json(data);
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
