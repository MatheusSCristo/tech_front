import { SemesterUserType } from "@/types/semester";
import { createContext, useState } from "react";

type SemesterContextType = {
  semesters: SemesterUserType[];
  setSemesters: React.Dispatch<React.SetStateAction<SemesterUserType[]>>;
};

const SemesterContext = createContext({} as SemesterContextType);

const SemesterProvider = ({ children }: { children: React.ReactNode }) => {
  const [semesters, setSemesters] = useState<SemesterUserType[]>([]);
  return (
    <SemesterContext.Provider value={{ semesters,setSemesters  }}>
      {children}
    </SemesterContext.Provider>
  );
};

export { SemesterContext, SemesterProvider };

