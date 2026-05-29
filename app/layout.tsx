import type { Metadata } from "next";
import { Barlow_Condensed, Bebas_Neue } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { SiteChrome } from "@/components/SiteChrome";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-barlow",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Strike Beer — Rock Bar & Burgers",
  description:
    "Premium rock bar e restaurante de burgers gourmet. Cerveja artesanal, música ao vivo e a melhor experiência gastronômica da cidade.",
  keywords: ["rock bar", "burgers gourmet", "cerveja artesanal", "Strike Beer"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${barlowCondensed.variable} ${bebasNeue.variable}`}>
      <body className="antialiased">
        <CartProvider>
          <SiteChrome>{children}</SiteChrome>
        </CartProvider>
      </body>
    </html>
  );
}
