import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import Activities from "@/components/sections/Activities";
import Protocol from "@/components/sections/Protocol";
import Numbers from "@/components/sections/Numbers";
import Duo from "@/components/sections/Duo";
import Projects from "@/components/sections/Projects";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Activities />
      <Protocol />
      <Numbers />
      <Duo />
      <Projects />
      <FinalCTA />
    </>
  );
}
