import { UserType } from "@/types/user";
import { createContext, useContext, useEffect, useState } from "react";
import { SemesterContext } from "./SemesterContext";

type UserContextType = {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
};

const UserContext = createContext({} as UserContextType);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const { setSemesters } = useContext(SemesterContext);
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user !="null" && user) {
      const newUser:UserType = JSON.parse(user);
      setUser(newUser);
      setSemesters(newUser.semesters.sort((a,b)=>a.semester-b.semester));
    }
  }, []);
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
  }, [user]);


  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };

