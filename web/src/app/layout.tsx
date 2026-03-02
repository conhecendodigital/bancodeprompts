import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "BANCO DE PROMPTS — Sua Biblioteca de Prompts de IA",
  description:
    "Explore milhares de prompts de IA para gerar imagens incríveis. Copie, use e crie arte com inteligência artificial.",
  keywords: ["prompts", "IA", "inteligência artificial", "imagens", "arte", "geração de imagens"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        {/* Fontes Premium (Google Fonts) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&family=Sora:wght@100..800&family=Instrument+Serif:ital@0;1&family=Fira+Code:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {/* Material Symbols Outlined */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col overflow-x-hidden">
        <div className="noise-overlay"></div>
        <Header />
        <main className="flex-1 w-full">{children}</main>
      </body>
    </html>
  );
}
