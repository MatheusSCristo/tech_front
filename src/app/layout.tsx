import type { Metadata } from "next";
import { Sansita } from "next/font/google";
import ContextProvider from "./context/ContextProvider";
import "./globals.css";

const sansita = Sansita({
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
  variable: "--font-sansita",
});

export const metadata: Metadata = {
  title: "GestãoTI",
  description: "Gerencie seus semestres de TI de forma simples e eficiente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ContextProvider>
        <body className={` ${sansita.className} h-screen`}>{children}</body>
      </ContextProvider>
    </html>
  );
}
