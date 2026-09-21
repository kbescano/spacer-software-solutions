import { Contact } from "@/components/Contact";
import { Cursor } from "@/components/Cursor";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Nav } from "@/components/Nav";
import { Preloader } from "@/components/Preloader";
import { Process } from "@/components/Process";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Services } from "@/components/Services";
import { Work } from "@/components/Work";

export default function Home() {
  return (
    <>
      <Preloader />
      <Cursor />
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Work />
        <Services />
        <Process />
        <Contact />
      </main>
    </>
  );
}
