import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BANCO DE PROMPTS — Sua Biblioteca de Prompts de IA",
  description:
    "Explore milhares de prompts de IA gratuitos para gerar imagens incríveis. Copie, use e crie arte com inteligência artificial.",
  keywords: ["prompts", "IA", "inteligência artificial", "imagens", "arte", "geração de imagens"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} antialiased`}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
