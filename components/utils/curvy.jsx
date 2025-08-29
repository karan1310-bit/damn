// app/components/CurvyArrow.jsx
"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
// Optional: if you don't have Club GreenSock, remove this import; fallback will run.
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

if (DrawSVGPlugin) gsap.registerPlugin(DrawSVGPlugin);

export default function CurvyArrow({
  className = "",
  delay = 1.8,   // when to start drawing
  duration = 4,  // how long the draw takes
}) {
  const svgRef = useRef(null);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const ctx = gsap.context(() => {
      const paths = Array.from(svg.querySelectorAll("path"));
      const hasDraw = !!gsap.plugins?.DrawSVGPlugin;

      // Hide BEFORE first visible paint & lock start states
      gsap.set(svg, { autoAlpha: 0 });
      if (hasDraw) {
        gsap.set(paths, { drawSVG: "0% 0%" });
      } else {
        // pure dash fallback
        paths.forEach((p) => {
          const len = p.getTotalLength();
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        });
      }

      // Reveal + animate
      const tl = gsap.timeline();
      tl.set(svg, { autoAlpha: 1, visibility: "visible", immediateRender: true }, 0)
        .to(
          paths,
          hasDraw
            ? { drawSVG: "0% 100%", duration, delay, ease: "power2.out", stagger: 0.15 }
            : { strokeDashoffset: 0, duration, delay, ease: "power2.out", stagger: 0.15 }
        );
    }, svgRef);

    return () => ctx.revert();
  }, [delay, duration]);

  return (
    <div className={`pointer-events-none rotate-45 ${className}`}>
      {/* Start hidden at FIRST PAINT to prevent flash */}
      <svg
        ref={svgRef}
        className="w-full h-auto text-black"
        style={{ opacity: 0, visibility: "hidden", willChange: "opacity, transform" }}
        viewBox="0 0 386 127"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2 123C9 35.9999 84.5 17 124 25.9999C217.764 47.3635 207 115 177.5 123C105.777 142.45 110.737 1.99991 232.5 2C310.5 2.00006 366.5 79 376 118L356.5 105.5"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M2 123C9 35.9999 84.5 17 124 25.9999C217.764 47.3635 207 115 177.5 123C105.777 142.45 110.737 1.99991 232.5 2C310.5 2.00006 366.5 79 376 118L384 97"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.95"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
