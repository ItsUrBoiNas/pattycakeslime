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
  metadataBase: new URL("https://patticakeslime.com"),
  title: "PattiCakeSlime | Handmade Slime by Patti 🍰",
  description:
    "The squishiest, stretchiest, most satisfying handmade slime — crafted with love by Patti. Shop cloud slime, butter slime, crunchy slime & more!",
  keywords: ["slime", "handmade slime", "cloud slime", "butter slime", "slime shop", "PattiCakeSlime"],
  openGraph: {
    title: "PattiCakeSlime | Handmade Slime by Patti 🍰",
    description:
      "The squishiest, stretchiest, most satisfying handmade slime — crafted with love by Patti. Shop cloud slime, butter slime, crunchy slime & more!",
    url: "https://patticakeslime.com",
    siteName: "PattiCakeSlime",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "PattiCakeSlime Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PattiCakeSlime | Handmade Slime by Patti 🍰",
    description:
      "The squishiest, stretchiest, most satisfying handmade slime — crafted with love by Patti.",
    images: ["/logo.png"],
  },
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
        {/* JSON-LD Structured Data for Rich Results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "PattiCakeSlime",
              description:
                "Handmade slime shop — cloud slime, butter slime, crunchy slime & more, crafted with love by Patti.",
              url: "https://patticakeslime.com",
              logo: "https://patticakeslime.com/logo.png",
              image: "https://patticakeslime.com/logo.png",
              priceRange: "$",
              sameAs: [],
            }),
          }}
        />
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <main>{children}</main>
          <Footer />

          {/* Global Gooey Filter */}
          <svg style={{ visibility: 'hidden', position: 'absolute' }} width="0" height="0" xmlns="http://www.w3.org/2000/svg" version="1.1">
            <defs>
              <filter id="goo">
                <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                <feComposite in="SourceGraphic" in2="goo" operator="atop" />
              </filter>
            </defs>
          </svg>
        </CartProvider>
      </body>
    </html>
  );
}
