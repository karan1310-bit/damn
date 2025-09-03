"use client";

import React, { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import Effect from "./Effect";
import Beffect from "./Beffect";
import Deffect from "./Deffect";
import CurvyArrow from "./utils/curvy";

const Hero = () => {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    // scope everything to the section
    const ctx = gsap.context(() => {
      // 1) Lock start states (these elements must have the classes below)
      gsap.set(".pop-in", { autoAlpha: 0, scale: 0, transformOrigin: "50% 50%" });
      gsap.set(".reveal-child", { yPercent: 120, autoAlpha: 0, filter: "blur(6px)" });

      // 2) Build timeline (paused)
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power4.out" } });

      tl.to(".tagline-child", { yPercent: 0, autoAlpha: 1, filter: "blur(0px)", duration: 1.0, stagger: 0.08 }, 0)
        .to(".h1-child, .h1m-child", {
  yPercent: 0,
  autoAlpha: 1,
  filter: "blur(0px)",
  duration: 1.0,
  stagger: 0.08, // lets mobile's two lines flow one after the other
}, "-=0.65")
        .to(".box-blue-child",{ yPercent: 0, autoAlpha: 1, filter: "blur(0px)", duration: 1.05 }, "-=0.55")
        .to(".box-red-child", { yPercent: 0, autoAlpha: 1, filter: "blur(0px)", duration: 1.05 }, "-=0.85")
        .to(".pop-in",        { autoAlpha: 1, scale: 1, duration: 0.75, ease: "back.out(1.6)", stagger: 0.2 }, "-=0.35")
        .to(".pop-in",        { scale: 1.03, duration: 0.14, yoyo: true, repeat: 1, ease: "power1.out" }, "-=0.2");

        tl.timeScale(1.2);
      // 3) Reveal the section and start the timeline on the next frame
      requestAnimationFrame(() => {
        if (rootRef.current) gsap.set(rootRef.current, { opacity: 1, autoAlpha: 1 });
        tl.play(0);
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="opacity-0 min-h-screen w-full px-4 md:px-10 py-4 bg-[#F0EBE6] overflow-hidden relative text-[#080807] font-DMregular"
    >
      <div className="flex flex-col mt-16 md:mt-24 leading-[0.9]">
        {/* Tagline row with per-word masks */}
        <div className="flex items-center uppercase md:px-2 text-sm md:text-base font-DMbold leading-none pt-6">
          <div className="basis-1/3 overflow-hidden">
            <h3 className="tagline-child reveal-child text-left tracking-[0.10em]">A</h3>
          </div>
          <div className="basis-1/3 overflow-hidden">
            <h3 className="tagline-child reveal-child text-center tracking-[0.10em]">damn</h3>
          </div>
          <div className="basis-1/3 overflow-hidden">
            <h3 className="tagline-child reveal-child text-right tracking-[0.10em]">good</h3>
          </div>
        </div>

        {/* H1 reveal */}
        {/* H1 (desktop single line) */}
<div className="overflow-hidden hidden md:block">
  <h1 className="h1-child reveal-child text-[19vw] mt-3 md:mt-2 md:text-[10.6vw] uppercase text-center font-DMbold">
    Design Engineer
  </h1>
</div>

{/* H1 (mobile split into two masked lines) */}
<div className="md:hidden mt-3">
  <div className="overflow-hidden">
    <h1 className="h1m-child reveal-child text-[18vw] uppercase text-center font-DMbold leading-[0.9]">
      Design
    </h1>
  </div>
  <div className="overflow-hidden -mt-1">
    <h1 className="h1m-child reveal-child text-[18vw] uppercase text-center font-DMbold leading-[0.9]">
      Engineer
    </h1>
  </div>
</div>

      </div>

      {/* POPPING SVG #1 */}
      <div className="absolute ml-[45vw] md:ml-[21vw] z-2 pt-68 md:pt-12">
        <img
          src="/svg/lets-go.svg"
          className="pop-in h-24 w-24 md:h-52 md:w-52 rotate-12 md:-rotate-6"
          style={{ willChange: "transform, opacity", backfaceVisibility: "hidden" }}
          alt="Let's go"
        />
      </div>

      {/* POPPING SVG #2 */}
      <div className="absolute ml-[75vw] md:ml-[87vw] pt-4 z-2">
        <img
          src="/svg/smiley.svg"
          className="pop-in h-16 w-16 md:h-28 md:w-28 -rotate-12 md:rotate-12"
          style={{ willChange: "transform, opacity", backfaceVisibility: "hidden" }}
          alt="Smiley"
        />
      </div>

      <div className="hidden md:flex relative pt-2 md:pt-20 justify-between">
        {/* BLUE BOX (Desktop) */}
        <div className="overflow-hidden">
          <div className="box-blue-child reveal-child text-left leading-tight bg-[#82A0FF] rounded-2xl px-4 py-4" style={{ willChange: "transform, opacity", backfaceVisibility: "hidden" }}>
            <h2 className="text-[20px] sm:text-[24px] text-left font-DMsemi">Contact</h2>
            <ul className="not-italic mt-1 text-[18px] sm:text-[20px] space-y-1">
              <li><Effect title="contact.karan131@gmail.com" link="mailto:contact.karan131@gmail.com" /></li>
              <li><Effect title="tel. +91 7225928721" link="tel:+91 7225928721" /></li>
              <li><Beffect title="currently freelancing" /></li>
            </ul>

            <h3 className="mt-4 text-[20px] sm:text-[24px] font-DMsemi">Social</h3>
            <ul className="mt-1 text-[18px] sm:text-[20px] space-y-1">
              <li><Effect title="ig./ bhati_.01" link="https://www.instagram.com/bhati_.01?igsh=Z3VyZjlpYjh5Znc2" /></li>
              <li><Effect title="ln./ karansingh" link="https://www.linkedin.com/in/karan-singh-bhati-2b4888316?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" /></li>
              <li><Effect title="git./ karan1310-bit" link="https://github.com/karan1310-bit" /></li>
            </ul>
          </div>
        </div>

        <CurvyArrow className="hidden md:block max-w-[800px] mx-auto mr-20 mt-24 h-44 w-44" />

        {/* RED BOX (Desktop) */}
        <div className="overflow-hidden">
          <div className="box-red-child reveal-child max-w-[55vw] bg-[#E8464E] px-4 py-4 rounded-2xl" style={{ willChange: "transform, opacity", backfaceVisibility: "hidden" }}>
            <h1 className="font-DMsemi leading-none tracking-[-0.01em] text-[13vw] sm:text-[10vw] md:text-[3.5vw]">
              <span className="block">Thinking Boldly.</span>
              <span className="block">Crafting Visually.</span>
            </h1>

            <p className="mt-8 md:mt-4 text-neutral-900 max-w-[1250px] text-xl sm:text-2xl md:text-2xl leading-tight">
              I help growing brands and startups gain an unfair advantage through premium, results driven websites.
            </p>

            <div className="mt-10 md:mt-4 flex items-center justify-between">
              <span className="relative">
                <Deffect title="Explore Services" link="#work" />
                <span className="block mt-0 h-[1px] w-32 bg-black transition-opacity group-hover:opacity-70" />
              </span>

              <span className="text-[13px] sm:text-sm text-neutral-700">(Scroll)</span>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="flex flex-col md:hidden items-start pt-12 justify-between">
        {/* RED BOX (Mobile) */}
        <div className="overflow-hidden">
          <div className="box-red-child reveal-child bg-[#E8464E] px-4 py-4 rounded-2xl" style={{ willChange: "transform, opacity", backfaceVisibility: "hidden" }}>
            <h1 className="font-DMsemi leading-none tracking-[-0.01em] text-[8vw]">
              <span className="block">Thinking Boldly.</span>
              <span className="block">Crafting Visually.</span>
            </h1>

            <p className="mt-2 text-neutral-900 max-w-[100vw] text-lg leading-tight">
              Not just makers. Campaign creators. Visual disruptors. Not just makers. Campaign creators. Visual disruptors.
            </p>
            <div className="mt-4 flex items-center justify-between">
              <div className="group inline-block text-[15px] sm:text-base font-medium">
                <span className="relative">
                  <Deffect title="Explore Services" link="#work" />
                  <span className="block mt-0 h-[1px] w-28 bg-black transition-opacity group-hover:opacity-70" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BLUE BOX (Mobile) */}
        <div className="mt-4 flex justify-between items-start text-left leading-tight">
          <div className="overflow-hidden">
            <div className="box-blue-child reveal-child bg-[#82A0FF] rounded-2xl px-4 py-4" style={{ willChange: "transform, opacity", backfaceVisibility: "hidden" }}>
              <h3 className=" text-sm font-DMsemi">Social</h3>
              <ul className="mt-1 text-sm space-y-0">
                <li><Effect title="ig./ bhati_.01" link="https://www.instagram.com/bhati_.01?igsh=Z3VyZjlpYjh5Znc2" /></li>
                <li><Effect title="ln./ karansingh" link="https://www.linkedin.com/in/karan-singh-bhati-2b4888316?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" /></li>
                <li><Effect title="git./ karan1310-bit" link="https://github.com/karan1310-bit" /></li>
              </ul>
            </div>
          </div>

          <CurvyArrow className="md:hidden max-w-[400px] mx-auto h-32 w-32 ml-12 mt-4" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
