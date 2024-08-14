"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import { UserProvider } from "./UserContext";

const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <UserProvider>{children}</UserProvider>
    </SessionProvider>
  );
};

export default ContextProvider;
