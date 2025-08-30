// app/components/Header.jsx
'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useWindowScroll } from 'react-use';
import Effect from './Effect';
import Deffect from './Deffect';

export default function Header({
  enterDelay = 0.1,     // align with your hero start
  enterDuration = 0.2,   // smooth drop duration
  itemStagger = 0.01,    // brand/links/cta stagger
}) {
  const navContainerRef = useRef(null);

  const { y: currentScrollY } = useWindowScroll();
  const prevScrollY = useRef(0);

  const [isNavVisible, setIsNavVisible] = useState(true);
  const [hasEntered, setHasEntered] = useState(false);

  // 1) Gorgeous entrance (pre-paint → no flash)
  useLayoutEffect(() => {
    const el = navContainerRef.current;
    if (!el) return;

    const reduce = typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // start hidden and slightly above with a soft blur
      gsap.set(el, { y: -28, autoAlpha: 0, filter: 'blur(6px)', willChange: 'transform, opacity, filter' });
      gsap.set(['.hdr-brand', '.hdr-cta', '.hdr-link'], { y: 10, autoAlpha: 0, filter: 'blur(6px)' });

      if (reduce) {
        // no animation for reduced motion
        gsap.set(el, { y: 0, autoAlpha: 1, filter: 'blur(0px)' });
        gsap.set(['.hdr-brand', '.hdr-cta', '.hdr-link'], { y: 0, autoAlpha: 1, filter: 'blur(0px)' });
        setHasEntered(true);
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: 'expo.out' }, // super smooth
        delay: enterDelay,
        onComplete: () => setHasEntered(true),
      });

      // container drop + un-blur
      tl.to(el, {
        y: 0,
        autoAlpha: 1,
        filter: 'blur(0px)',
        duration: enterDuration,
      }, 0);

      // brand / links / cta reveal
      tl.to('.hdr-brand', { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.6 }, '-=0.55')
        .to('.hdr-link',  { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.5, stagger: itemStagger }, '-=0.48')
        .to('.hdr-cta',   { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.5 }, '-=0.42');
    }, navContainerRef);

    return () => ctx.revert();
  }, [enterDelay, enterDuration, itemStagger]);

  // 2) Scroll logic (only after entrance completes)
  useEffect(() => {
    if (!hasEntered) return;
    const el = navContainerRef.current;
    if (!el) return;

    if (currentScrollY === 0) {
      setIsNavVisible(true);
      el.classList.remove('floating-nav');
    } else if (currentScrollY > prevScrollY.current) {
      setIsNavVisible(false);
      el.classList.add('floating-nav');
    } else if (currentScrollY < prevScrollY.current) {
      setIsNavVisible(true);
      el.classList.add('floating-nav');
    }
    prevScrollY.current = currentScrollY;
  }, [currentScrollY, hasEntered]);

  // 3) Smooth show/hide on scroll
  useEffect(() => {
    if (!hasEntered) return;
    const el = navContainerRef.current;
    if (!el) return;

    gsap.to(el, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: isNavVisible ? 0.34 : 0.28, // show a hair slower than hide
      ease: isNavVisible ? 'expo.out' : 'power2.in',
      overwrite: 'auto',
    });
  }, [isNavVisible, hasEntered]);

  return (
    <div
      ref={navContainerRef}
      className="opacity-0 fixed inset-x-2 top-2 md:top-3 z-40 h-14 sm:h-16 border-none bg-[#F0EBE6] text-[#080807] font-DMregular transition-all duration-700 md:inset-x-6"
      style={{ backfaceVisibility: 'hidden' }}
    >
      <header className="glass-chrome absolute top-1/2 w-full -translate-y-1/2">
        <nav className="glass-chrome flex justify-between items-center py-6 md:py-6 px-4 md:px-6">
          {/* Brand */}
          <a href="#home" className="hdr-brand">
            <h2 className="text-base leading-[1.1] font-DMregular md:text-xl">
              Karan <br className="md:hidden" />
              <span className="font-DMregular text-xs md:text-lg text-gray-600">
                (Web Designer &amp; Developer)
              </span>
            </h2>
          </a>

          {/* Mobile CTA */}
          <h2 className="hdr-cta md:hidden text-sm md:text-lg nav-hover-btn font-DMregular group">
            <Effect title="Book a Call" link="mailto:contact.sleekframe@gmail.com" />
          </h2>

          {/* Desktop nav */}
          <div className="hidden md:flex h-full font-DMregular items-center text-base md:text-lg gap-2">
            <span className="hdr-link"><Deffect title="Services," link="#services" /></span>
            <span className="hdr-link"><Deffect title="work," link="#work" /></span>
            <span className="hdr-link"><Deffect title="about," link="#about" /></span>
            <span className="hdr-link"><Deffect title="contact" link="#footer" /></span>
          </div>
        </nav>
      </header>

      {/* Glass (rectangle) */}
      <style jsx global>{`
        .floating-nav {
          background: rgba(255, 255, 255, 0.58);
          -webkit-backdrop-filter: saturate(180%) blur(14px);
          backdrop-filter: saturate(180%) blur(14px);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }
        .floating-nav:hover {
          background: rgba(255, 255, 255, 0.66);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.14);
        }
        @media (prefers-reduced-motion: reduce) {
          .floating-nav { transition: none !important; }
        }
      `}</style>
    </div>
  );
}
