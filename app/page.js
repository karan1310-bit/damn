
import Hero from "@/components/Hero";
import Header from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";

export default function Home() {
  return (
   <main className="min-h-screen w-full bg-[#FCFCFC] text-[#080807]">
     <SmoothScroll />
    <Header />
    <Hero />
    <div className="h-screen"></div>
   </main>
  );
}
