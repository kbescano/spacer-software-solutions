import { Contact } from "@/components/Contact";
import { Cursor } from "@/components/Cursor";
import { FAQ } from "@/components/FAQ";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Nav } from "@/components/Nav";
import { Portal } from "@/components/Portal";
import { Preloader } from "@/components/Preloader";
import { Process } from "@/components/Process";
import { QuoteJourney } from "@/components/QuoteJourney";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Services } from "@/components/Services";
import { Work } from "@/components/Work";

export default function Home() {
  return (
    <>
      <Preloader />
      <Cursor />
      <ScrollProgress />
      <QuoteJourney />
      <Nav />
      <main>
        <Hero />
        <Portal />
        <Marquee />
        <Work />
        <Services />
        <Process />
        <FAQ />
        <Contact />
      </main>
    </>
  );
}
