import { HeroSection } from "@/components/HeroSection";
import { BurgersSection } from "@/components/BurgersSection";
import { BeersSection } from "@/components/BeersSection";
import { EventSection } from "@/components/EventSection";
import { Preview } from "@/components/Preview";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <BurgersSection />
      <BeersSection />
      <EventSection />
      <Preview />
      <Footer />
    </main>
  );
}
