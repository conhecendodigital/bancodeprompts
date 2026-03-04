import type { Metadata } from "next";
import { Sora, Instrument_Serif, Fira_Code } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Banco de Prompts — O atalho para imagens perfeitas com IA",
  description: "Não sabe o que escrever para a IA? Nós já escrevemos para você. +250 prompts prontos para gerar imagens profissionais. Copie, cole e veja a mágica acontecer.",
  metadataBase: new URL("https://prompt.omatheusai.com.br"),
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: "Banco de Prompts — O atalho para imagens perfeitas com IA",
    description: "Não sabe o que escrever para a IA? Nós já escrevemos para você. +250 prompts prontos. Copie, cole e veja a mágica.",
    url: "https://prompt.omatheusai.com.br",
    siteName: "Banco de Prompts",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Banco de Prompts — Copie, Cole e veja a mágica acontecer",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Banco de Prompts — O atalho para imagens perfeitas com IA",
    description: "Copie, cole e veja a mágica acontecer. +250 prompts profissionais prontos para usar.",
    images: ["/images/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${sora.variable} ${instrumentSerif.variable} ${firaCode.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

