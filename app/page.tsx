import { HeroSection } from "@/components/HeroSection";
import { BurgersSection } from "@/components/BurgersSection";
import { EventSection } from "@/components/EventSection";
import { LocalSection } from "@/components/LocalSection";
import { Preview } from "@/components/Preview";
import { Footer } from "@/components/Footer";
import { productService } from "@/server/services/product.service";
import type { Product } from "@/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  let products: Product[] = [];
  try {
    products = await productService.listActive();
  } catch {
    // Se o banco estiver indisponível, a vitrine renderiza vazia em vez de quebrar.
    products = [];
  }

  return (
    <main>
      <HeroSection />
      <BurgersSection products={products} />
      <LocalSection />
      <EventSection />
      <Preview />
      <Footer />
    </main>
  );
}
