import type { Metadata } from "next";
import { Sansita } from "next/font/google";
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
      <body className={` ${sansita.className}`}>
        {children}
      </body>
    </html>
  );
}
