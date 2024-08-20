import CryptoJS from 'crypto-js';
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const encrypt = (text: string) => {
  const key=process.env.ENCRYPTION_KEY;
  if(!key){
    return '';
  }
  const encrypted= CryptoJS.AES.encrypt(text,key).toString();
  return encrypted;
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      const newSession = { ...session, accessToken: token.accessToken };
      return newSession;
    },

    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const token = account.id_token;
          const response = await fetch(
            `http://localhost:8080/auth/google/${token}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.status === 401) {
            const email = user.email;
            if (!email) {
              return false;
            }
            const encryptedEmail = encrypt(email);
            return `/auth/google/register/${encodeURIComponent(encryptedEmail)}`;
          } else if (response.status == 500) {
            throw new Error("Erro ao conectar com o servidor");
          }
        } catch (error) {
          console.error("Erro ao obter o JWT do backend:", error);
        }
      }
      return true;
    },
  },
};

export default NextAuth(authOptions);
