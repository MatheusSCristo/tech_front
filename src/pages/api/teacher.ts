import { TeacherType } from "@/types/teacher";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
        const cookies=req.cookies;
        const accessToken = cookies.access_token;
      if (accessToken) {
        const response = await fetchWithAuth(
          "http://localhost:8080/teacher",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
          accessToken
        );
        if (!response.ok) {
          console.log("error")
          return;
        }
        const data: TeacherType[] = await response.json();

        res.status(200).json(data);
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
