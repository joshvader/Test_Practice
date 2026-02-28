// @ts-ignore – Cannot find module 'next' or its corresponding type declarations.
import type { Metadata } from "next";

// @ts-ignore – Cannot find module 'next/font/google' or its corresponding type declarations.
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TestProvider } from "../context/TestContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistema de Evaluación de Practicantes",
  description: "Plataforma de evaluación técnica para practicantes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TestProvider>
          {children}
        </TestProvider>
      </body>
    </html>
  );
}
