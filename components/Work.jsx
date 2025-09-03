"use client";

import Image from "next/image";
import React from "react";

/**
 * WORK ’25 — exact JSX replica (Next.js + Tailwind only)
 * - Drop replacement for a section on your homepage.
 * - Replace image paths with your assets in /public/images.
 */
export default function WorkSection() {
  return (
    <section className="w-full bg-[#F0EBE6]">
      <div className="relative px-4 sm:px-6 md:px-10 pb-8 pt-8 font-DMregular">

        {/* ─── Jumbo headline row ───────────────────────────────────── */}
        <div className="mt-4 flex items-end justify-between">
          <h1 className="text-[clamp(56px,10vw,140px)] leading-none font-DMbold tracking-tight text-neutral-900">
            WORK
          </h1>
          <span className="ml-6 text-[clamp(56px,9vw,130px)] leading-none font-DMbold tracking-tight text-neutral-900">
            ’25
          </span>
        </div>

        {/* ─── Cards grid ───────────────────────────────────────────── */}
        <div className="mt-7 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1 */}
          <article className="rounded-[28px] bg-[#0F0F10] text-white ring-1 ring-neutral-800/70 overflow-hidden">
            <div className="p-6">
              <div className="overflow-hidden rounded-2xl ring-1 ring-neutral-800">
                <Image
                  src="/images/3.jpg"
                  alt="Coffee, bouquet and pink bag on a black table"
                  width={1400}
                  height={940}
                  className="h-[40vh] md:h-[60vh] w-full object-cover"
                  priority
                />
              </div>

              {/* footer */}
              <div className="mt-4 font-DMregular">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid place-items-center h-9 w-9 rounded-full bg-neutral-800 ring-1 ring-neutral-700/60">
                      {/* avatar placeholder */}
                      <span className="text-[18px]">🍩</span>
                    </div>
                    <h3 className="text-lg font-DMsemi tracking-tight">
                      JAZMIN WONG
                    </h3>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <span className="font-DMsemi tracking-wider">
                      PORTFOLIO
                    </span>
                    <span className="font-DMsemi tracking-wider">2025</span>
                  </div>
                </div>

                <div className="mt-3 text-[12px] font-DMregular tracking-[0.08em] text-neutral-300">
                  <div className="min-w-max">
                    <span className="mr-4">GSAP</span>
                    <span className="mr-4">TAILWIND CSS</span>
                    <span className="mr-4">LENIS</span>
                    <span className="mr-4">VERCEL</span>
                    <span className="mr-4">ART DIRECTION</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Card 2 */}
          <article className="rounded-[28px] bg-[#0F0F10] text-white ring-1 ring-neutral-800/70 overflow-hidden">
            <div className="p-6">
              <div className="overflow-hidden rounded-2xl ring-1 ring-neutral-800">
                <Image
                  src="/images/1.jpg"
                  alt="Portrait through vertical yellow glass"
                  width={1400}
                  height={940}
                  className="h-[40vh] md:h-[60vh] w-full object-cover"
                />
              </div>

              {/* footer */}
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid place-items-center h-9 w-9 rounded-full bg-neutral-800 ring-1 ring-neutral-700/60">
                      {/* icon placeholder */}
                      <span className="text-[18px]">✚</span>
                    </div>
                    <h3 className="text-lg font-DMsemi tracking-tight">
                      TRACKSTACK
                    </h3>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <span className="font-DMsemi tracking-wider">PRODUCT</span>
                    <span className="font-DMsemi tracking-wider">2025</span>
                  </div>
                </div>

                <div className="mt-3 text-[12px] font-DMregular tracking-[0.08em] text-neutral-300">
                  <div className="min-w-max">
                    <span className="mr-4">BRAND DESIGN</span>
                    <span className="mr-4">STRATEGY</span>
                    <span className="mr-4">UX</span>
                    <span className="mr-4">UI</span>
                    <span className="mr-4">WEB DESIGN</span>
                    <span className="mr-4">MEDIA PRODUCTION</span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>

      </div>
    </section>
  );
}
