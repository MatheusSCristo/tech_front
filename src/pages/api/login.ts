import { loginRequestSchema } from '@/schemas/loginRequestSchema';
import { NextApiRequest, NextApiResponse } from 'next';


type Data={
  user_data:{},
  access_token:string,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const body = loginRequestSchema.parse(req.body);
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if(!response.ok){
        const errorData = await response.json();
        res.status(response.status).json({ error: errorData || 'Erro ao logar usuário' });
        return;
      }
      
      const data:Data = await response.json();
      res.status(response.status).json(data.user_data);
    } catch (error:any) {
      if(error.cause.code === 'ECONNREFUSED'){
        res.status(500).json({ error: 'Erro ao conectar com o servidor' });
      }   
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
