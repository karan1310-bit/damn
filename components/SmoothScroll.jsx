'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1 });

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // (optional) sync with GSAP ScrollTrigger if you’re using it anywhere
    // @ts-ignore
    const ST = (typeof window !== 'undefined' && (window).ScrollTrigger) || null;
    if (ST && typeof ST.update === 'function') {
      lenis.on('scroll', ST.update);
    }

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}