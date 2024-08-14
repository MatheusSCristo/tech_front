import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId:
        "",
      clientSecret: "",
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
          const response = await fetch("http://localhost:8080/auth/google", {
            method: "POST",
            headers:{
              "Content-Type":"application/json",
            },
            body:JSON.stringify({access_token: account.access_token}),
          });
          const data = await response.json();
          console.log(data);
        } catch (error) {
          console.error("Erro ao obter o JWT do backend:", error);
        }
      }
      return true;
    },
  },  
});
