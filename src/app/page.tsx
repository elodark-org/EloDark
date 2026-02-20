import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/landing/hero";
import { GameGrid } from "@/components/landing/game-grid";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Reviews } from "@/components/landing/reviews";
import { FAQ } from "@/components/landing/faq";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      <Hero />
      <GameGrid />
      <HowItWorks />
      <Reviews />
      <FAQ />
      <Footer />
    </div>
  );
}
