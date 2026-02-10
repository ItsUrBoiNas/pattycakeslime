import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "PattiCakeSlime | Handmade Slime by Grandma Patti 🍰",
  description:
    "The squishiest, stretchiest, most satisfying handmade slime — crafted with love by Grandma Patti. Shop cloud slime, butter slime, crunchy slime & more!",
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
        className={`${fredoka.variable} ${nunito.variable} antialiased bg-off-white text-foreground`}
      >
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
