import React from "react";
import Effect from "./Effect";
import Beffect from "./Beffect";
import Deffect from "./Deffect";

const Hero = () => {
  return (
    <section className="min-h-screen w-full px-4 md:px-10 py-4 bg-[#FCFCFC] text-[#080807] font-DMregular">
      <div className="flex flex-col mt-16 md:mt-24 leading-[0.9]">
        <div className="flex items-center uppercase md:px-2 text-sm md:text-base font-DMbold leading-none pt-6">
          <h3 className="basis-1/3 text-left tracking-[0.10em]">A</h3>
          <h3 className="basis-1/3 text-center tracking-[0.10em]">damn</h3>
          <h3 className="basis-1/3 text-right tracking-[0.10em]">good</h3>
        </div>

        <div>
          <h1 className="text-[19vw] mt-3 md:mt-2 md:text-[10.6vw] uppercase text-center font-DMbold">
            Design Engineer
          </h1>
        </div>
      </div>

      <div className="hidden md:flex items-start pt-6 sm:pt-20 justify-between">
        <div className="text-left leading-tight">
          <h2 className="text-[20px] sm:text-[24px] text-left font-DMsemi">
            Contact
          </h2>
          <ul className="not-italic mt-1 text-[18px] sm:text-[20px] space-y-1">
            <li>
              <Effect title="contact.karan131@gmail.com" link="mailto:contact.karan131@gmail.com" />
            </li>
            <li>
              <Effect title="tel. +91 7225928721" link="tel:+91 7225928721" />
            </li>
            <li>
              <Beffect title="currently freelancing" />
            </li>
          </ul>

          <h3 className="mt-6 text-[20px] sm:text-[24px] font-DMsemi">
            Social
          </h3>
          <ul className="mt-1 text-[18px] sm:text-[20px] space-y-1">
            <li>
              <Effect title="ig./ bhati_.01" link="https://www.instagram.com/bhati_.01?igsh=Z3VyZjlpYjh5Znc2" />
            </li>
            <li>
              <Effect title="ln./ karansingh" link="https://www.linkedin.com/in/karan-singh-bhati-2b4888316?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" />
            </li>
            <li>
              
              <Effect title="git./ karan1310-bit" link="https://github.com/karan1310-bit" />
            </li>
          </ul>
        </div>

        <div className="max-w-[55vw]">
          <h1 className="font-DMsemi uppercase leading-none tracking-[-0.01em] text-[13vw] sm:text-[10vw] md:text-[3.5vw]">
            <span className="block">Thinking Boldly.</span>
            <span className="block">Crafting Visually.</span>
          </h1>

          <p className="mt-8 sm:mt-2 text-neutral-900 max-w-[1250px] text-xl sm:text-2xl md:text-[26px] leading-tight">
           I help growing brands and startups gain an unfair advantage through premium, results driven websites.
          </p>

          <div className="mt-10 sm:mt-6 flex items-center justify-between">
            <span className="relative">
                 <Deffect title="Explore Services" link="#work" />
                <span className="block mt-0 h-[1px] w-32 bg-black transition-opacity group-hover:opacity-70" />
              </span>

            <span className="text-[13px] sm:text-sm text-neutral-700">
              (Scroll)
            </span>
          </div>
        </div>
      </div>


 <div className="flex flex-col md:hidden items-start pt-16 justify-between">
        <div className="">
          <h1 className="font-DMsemi uppercase leading-none tracking-[-0.01em] text-[8vw]">
            <span className="block">Thinking Boldly.</span>
            <span className="block">Crafting Visually.</span>
          </h1>

          <p className="mt-2 text-neutral-900 max-w-[100vw] text-lg leading-tight">
            Not just makers. Campaign creators. Visual disruptors. Not just makers. Campaign creators. Visual disruptors. 
          </p>
          <div className="mt-4 flex items-center justify-between">
            <div
              className="group inline-block text-[15px] sm:text-base font-medium"
            >
              <span className="relative">
                 <Deffect title="Explore Services" link="#work" />
                <span className="block mt-0 h-[1px] w-28 bg-black transition-opacity group-hover:opacity-70" />
              </span>
            </div>

            
          </div>

         <div className="mt-14 flex justify-between items-start text-left leading-tight">

         <div>
          <h3 className=" text-sm font-DMsemi">
            Social
          </h3>
          <ul className="mt-1 text-sm space-y-0">
             <li>
              <Effect title="ig./ bhati_.01" link="https://www.instagram.com/bhati_.01?igsh=Z3VyZjlpYjh5Znc2" />
            </li>
            <li>
              <Effect title="ln./ karansingh" link="https://www.linkedin.com/in/karan-singh-bhati-2b4888316?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" />
            </li>
            <li>
              
              <Effect title="git./ karan1310-bit" link="https://github.com/karan1310-bit" />
            </li>
          </ul></div>
          <span className="text-[13px] sm:text-sm text-neutral-700">
              (Scroll)
            </span></div>
        </div>
         
        </div>
  
      
    </section>
  );
};

export default Hero;
