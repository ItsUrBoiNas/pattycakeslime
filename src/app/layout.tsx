import type { Metadata } from "next";
import { Fredoka, Nunito, Titan_One } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const titanOne = Titan_One({
  variable: "--font-titan-one",
  weight: "400",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "PattiCakeSlime | Handmade Slime by Patti 🍰",
  description:
    "The squishiest, stretchiest, most satisfying handmade slime — crafted with love by Patti. Shop cloud slime, butter slime, crunchy slime & more!",
  keywords: ["slime", "handmade slime", "cloud slime", "butter slime", "slime shop", "PattiCakeSlime"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${fredoka.variable} ${nunito.variable} ${titanOne.variable} antialiased bg-background text-foreground`}
      >
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
