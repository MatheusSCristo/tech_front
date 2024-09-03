"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import { SemesterProvider } from "./SemesterContext";
import { UserProvider } from "./UserContext";

const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <SemesterProvider>
        <UserProvider>{children}</UserProvider>
      </SemesterProvider>
    </SessionProvider>
  );
};

export default ContextProvider;
