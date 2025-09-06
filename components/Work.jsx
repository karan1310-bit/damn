// app/components/WorkSection.jsx
"use client";

import Image from "next/image";
import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

const TAGS_A = ["GSAP", "TAILWIND CSS", "ART DIRECTION", "DESIGN", "BRANDING", "ANIMATION", "MARKETING", "SOCIAL MEDIA"];
const TAGS_B = ["NEXT.JS", "TYPESCRIPT", "UX/UI", "FRAMER MOTION", "SEO", "COPYWRITING", "GSAP", "TAILWIND CSS"];

/**
 * GSAP Seamless Marquee
 * - Duplicates tag set until it covers at least 2x container width (no gaps)
 * - Animates one set width, wraps with a modulo so it's truly infinite
 * - Recomputes on resize
 */
function MarqueeRow({ tags, reverse = false, pxPerSec = 60 }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const tlRef = useRef(null);

  // how many times to repeat the tag set inside the track
  const [repeats, setRepeats] = useState(2);

  // build repeated children
  const children = [];
  for (let r = 0; r < repeats; r++) {
    for (let i = 0; i < tags.length; i++) {
      const key = `${r}-${i}-${tags[i]}`;
      children.push(
        <span key={key} className="mr-4">
          {tags[i]}
        </span>
      );
    }
  }

  useLayoutEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const setup = () => {
      // kill any previous tween
      tlRef.current && tlRef.current.kill();

      // Measure current widths
      const containerW = container.offsetWidth;
      const trackW = track.scrollWidth;

      // width of a single tag set (approx = total / repeats)
      const singleSetW = Math.max(1, Math.round(trackW / repeats));

      // Ensure enough repeats so TWO sets cover the container (no blank)
      const needed = Math.max(2, Math.ceil((containerW * 2) / singleSetW));
      if (needed !== repeats) {
        setRepeats(needed);
        return; // will re-run after render
      }

      // Animate exactly ONE set width and wrap using modulo
      const distance = singleSetW;
      const duration = distance / Math.max(1, pxPerSec);

      const wrapX = gsap.utils.wrap(-distance, 0);

      // start positions: 0->-distance (normal) or -distance->0 (reverse)
      const fromX = reverse ? -distance : 0;
      const toX = reverse ? 0 : -distance;

      tlRef.current = gsap.fromTo(
        track,
        { x: fromX },
        {
          x: toX,
          duration,
          ease: "none",
          repeat: -1,
          modifiers: {
            x: (x) => wrapX(parseFloat(x)) + "px",
          },
        }
      );
    };

    // initial
    setup();

    // re-run on resize
    const ro = new ResizeObserver(setup);
    ro.observe(container);
    ro.observe(track);

    return () => {
      ro.disconnect();
      tlRef.current && tlRef.current.kill();
    };
  }, [repeats, reverse, pxPerSec, tags.join("|")]);

  return (
    // keep your wrapper text classes EXACTLY the same
    <div
      ref={containerRef}
      className="mt-3 text-[10px] md:text-[14px] font-DMregular tracking-[0.08em] text-neutral-300"
    >
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex items-center whitespace-nowrap will-change-transform"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * WORK '25 — with seamless marquees
 */
export default function WorkSection() {
  return (
    <section className="w-full bg-[#F0EBE6]" id="work">
      <div className="relative px-4 sm:px-6 md:px-10 pb-8 pt-8 font-DMregular">
        {/* Jumbo headline row */}
        <div className="mt-4 flex items-end justify-between">
          <h1 className="text-[clamp(56px,10vw,140px)] leading-none font-DMbold tracking-tight text-neutral-900">
            WORK
          </h1>
          <span className="ml-6 text-[clamp(56px,9vw,130px)] leading-none font-DMbold tracking-tight text-neutral-900">
            ’25
          </span>
        </div>

        {/* Cards grid */}
        <div className="mt-7 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1 */}
          <article className="rounded-2xl bg-[#0F0F10] text-white ring-1 ring-neutral-800/70 overflow-hidden">
            <div className="p-4 md:p-6">
              <div className="overflow-hidden rounded-2xl ring-1 ring-neutral-800">
                <Image
                  src="/images/s3.png"
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
                    <div className="grid place-items-center h-7 w-7 rounded-full bg-neutral-800 ring-1 ring-neutral-700/60">
                      <span className="text-[18px]">🍩</span>
                    </div>
                    <h3 className="text-md md:text-lg font-DMsemi tracking-tight">
                      SLEEKFRAME
                    </h3>
                  </div>
                <div className="flex items-center gap-6 text-xs md:text-sm">
                    <span className="font-DMsemi tracking-wider">PORTFOLIO</span>
                    <span className="font-DMsemi tracking-wider">2025</span>
                  </div>
                </div>

                {/* Seamless marquee A (leftward) */}
                <MarqueeRow tags={TAGS_A} pxPerSec={50} />
              </div>
            </div>
          </article>

          {/* Card 2 */}
          <article className="rounded-2xl bg-[#0F0F10] text-white ring-1 ring-neutral-800/70 overflow-hidden">
            <div className="p-4 md:p-6">
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
              <div className="mt-4 font-DMregular">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid place-items-center h-7 w-7 rounded-full bg-neutral-800 ring-1 ring-neutral-700/60">
                      <span className="text-[18px]">🍩</span>
                    </div>
                    <h3 className="text-md md:text-lg font-DMsemi tracking-tight">
                      DISCODEN
                    </h3>
                  </div>
                  <div className="flex items-center gap-6 text-xs md:text-sm">
                    <span className="font-DMsemi tracking-wider">PRODUCT</span>
                    <span className="font-DMsemi tracking-wider">2025</span>
                  </div>
                </div>

                {/* Seamless marquee B (reverse, slightly slower) */}
                <MarqueeRow tags={TAGS_B} reverse pxPerSec={50} />
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
