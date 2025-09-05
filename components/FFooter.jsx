"use client";

import Image from "next/image";
import Effect from "./Effect";
// import Beffect from "./Beffect"; // keep if you want a status badge

export default function Contact() {
  return (
    <section className="relative min-h-screen w-full bg-[#F0EBE6] text-[#080807] overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* TOP: 50/50 */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12 pt-16 sm:pt-20 md:pt-24 lg:pt-28 xl:pt-32">
          {/* LEFT: Signature */}
          <figure className="flex justify-center md:justify-start">
            {/* Use your transparent PNG for best results */}
            <Image
              src="/images/sign.png" // replace with your transparent export path if different
              alt="Karan signature"
              width={1000}
              height={300}
              priority
              className="w-[260px] sm:w-[360px] md:w-[520px] h-auto"
            />
          </figure>

          {/* RIGHT: Headline */}
          <article className="text-center md:text-left">
            <h1 className="leading-none text-5xl md:text-7xl font-DMsemi">
              Let's make some good shit.
            </h1>
          </article>
        </div>

        
      </div>
    </section>
  );
}
