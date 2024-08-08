import type { Metadata } from "next";
import { Sansita, VT323 } from "next/font/google";
import "./globals.css";

const sansita = Sansita({
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
  variable: "--font-sansita",
});

const vt323 = VT323({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-vt",
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
      <body className={`${sansita.className} ${vt323.className}`}>
        {children}
      </body>
    </html>
  );
}
