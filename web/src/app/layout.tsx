import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Banco de Prompts | Chave.AI",
  description:
    "Desbloqueie o poder da Inteligência Artificial. Acesse nossa biblioteca exclusiva com milhares de prompts testados e validados para gerar imagens ultra-realistas e resultados profissionais em segundos.",
  keywords: ["prompts", "IA", "inteligência artificial", "midjourney", "chatgpt", "imagens", "arte", "chave.ai", "escrever prompts", "geração de imagens"],
  openGraph: {
    title: "Banco de Prompts | Sua Biblioteca Exclusiva",
    description: "Acesse milhares de prompts testados e validados para gerar imagens incríveis com Inteligência Artificial. Copie, cole e crie arte profissional em segundos.",
    url: "https://obancodeprompts.omatheusai.com.br/",
    siteName: "Chave.AI",
    images: [
      {
        url: "/opengraph-image.jpg", // The user will place this image in the public folder
        width: 1200,
        height: 630,
        alt: "Banco de Prompts | Chave.AI",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Banco de Prompts | Chave.AI",
    description: "Milhares de prompts validados para você gerar imagens ultra-realistas em segundos.",
    images: ["/opengraph-image.jpg"], // Same image for Twitter
  },
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
