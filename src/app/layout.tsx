import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-family",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PortoBay NPS",
  description: "Pesquisa de Satisfação PortoBay",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={outfit.className}>
        {children}
      </body>
    </html>
  );
}
