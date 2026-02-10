import Hero from "@/components/Hero";
import LiveStatus from "@/components/LiveStatus";
import LiveQueue from "@/components/LiveQueue";
import BestSellers from "@/components/BestSellers";
import CharmGallery from "@/components/CharmGallery";
import TikTokFeed from "@/components/TikTokFeed";
import AboutPatti from "@/components/AboutPatti";

export default function Home() {
  return (
    <>
      <LiveStatus />
      <Hero />
      <LiveQueue />
      <BestSellers />
      <CharmGallery />
      <TikTokFeed />
      <AboutPatti />
    </>
  );
}
