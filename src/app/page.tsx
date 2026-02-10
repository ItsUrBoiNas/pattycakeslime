import Hero from "@/components/Hero";
import CountdownTimer from "@/components/CountdownTimer";
import BestSellers from "@/components/BestSellers";
import TikTokFeed from "@/components/TikTokFeed";
import AboutPatti from "@/components/AboutPatti";

export default function Home() {
  return (
    <>
      <Hero />
      <CountdownTimer />
      <BestSellers />
      <TikTokFeed />
      <AboutPatti />
    </>
  );
}
