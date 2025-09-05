
import About from "@/components/About";
import Parallax from "@/components/cards/Parallax";
import GetInTouch from "@/components/Footer";
import Hero from "@/components/Hero";
import Header from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import WorkSection from "@/components/Work";

export default function Home() {
  return (
   <main className="min-h-screen w-full bg-[#F0EBE6] text-[#080807]">
     <SmoothScroll />
    <Header />
    <Hero />
    <About />
    <WorkSection />
    <Parallax />
    <GetInTouch />
   </main>
  );
}
