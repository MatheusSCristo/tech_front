import { UserType } from "@/types/user";
import { createContext, useEffect, useState } from "react";

type UserContextType = {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
};

const UserContext = createContext({} as UserContextType);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
    }
  },[]);
  useEffect(() => {
    if(user)
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };

