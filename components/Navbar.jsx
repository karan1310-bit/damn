// app/components/Header.jsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useWindowScroll } from 'react-use';
import Effect from './Effect';
import Deffect from './Deffect';

/**
 * SleekFrame Header
 * - Your original layout & GSAP behavior
 * - Glass + border + shadow via .floating-nav
 * - Rectangle border radius (not pill)
 */
export default function Header() {
  const navContainerRef = useRef(null);

  // scroll tracking (react-use)
  const { y: currentScrollY } = useWindowScroll();
  const prevScrollY = useRef(0);

  // visibility state
  const [isNavVisible, setIsNavVisible] = useState(true);

  // Decide when to show/hide and when to toggle floating style
  useEffect(() => {
    const el = navContainerRef.current;
    if (!el) return;

    if (currentScrollY === 0) {
      // back at top — show and remove floating chrome
      setIsNavVisible(true);
      el.classList.remove('floating-nav');
    } else if (currentScrollY > prevScrollY.current) {
      // scrolling down — hide
      setIsNavVisible(false);
      el.classList.add('floating-nav');
    } else if (currentScrollY < prevScrollY.current) {
      // scrolling up — show
      setIsNavVisible(true);
      el.classList.add('floating-nav');
    }

    prevScrollY.current = currentScrollY;
  }, [currentScrollY]);

  // Animate the container in/out with GSAP
  useEffect(() => {
    const el = navContainerRef.current;
    if (!el) return;

    gsap.to(el, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.25,
      ease: 'power2.out',
      overwrite: true,
    });
  }, [isNavVisible]);

  return (
     <div
      ref={navContainerRef}
      className="fixed inset-x-2 top-2 md:top-3 z-40 h-14 sm:h-16 border-none bg-[#FCFCFC] text-[#080807] font-DMregular transition-all duration-700 md:inset-x-6"
    >
      {/* Apply glassy look to header as well */}
      <header className="glass-chrome absolute top-1/2 w-full -translate-y-1/2">
        {/* Apply glassy look to nav as well */}
        <nav className="glass-chrome flex justify-between items-center py-6 md:py-6 px-4 md:px-6">
          {/* Brand */}
          <a href="#home">
            <h2 className="text-base leading-[1.1] font-DMregular md:text-xl">
              Karan <br className="md:hidden" />
              <span className="font-DMregular text-xs md:text-lg text-gray-600">
                (Web Designer &amp; Developer)
              </span>
            </h2>
          </a>
          {/* Mobile CTA (kept exactly like your original) */}
          <h2 className="md:hidden text-sm md:text-lg nav-hover-btn font-DMregular group">
            <Effect title="Book a Call" link="mailto:contact.sleekframe@gmail.com" />
          </h2>

          {/* Desktop nav (kept exactly like your original) */}
          <div className="hidden md:flex h-full font-DMregular items-center text-base md:text-lg gap-2">
            <Deffect title="Services," link="#services" />
            <Deffect title="work," link="#work" />
            <Deffect title="about," link="#about" />
            <Deffect title="contact" link="#footer" />
          </div>
        </nav>
      </header>

      {/* Glass + border + shadow (rectangle) */}
      <style jsx global>{`
        .floating-nav {
          /* light glass / frosted white */
          background: rgba(255, 255, 255, 0.58);
          -webkit-backdrop-filter: saturate(180%) blur(14px);
          backdrop-filter: saturate(180%) blur(14px);

          /* rectangle corners (no pill) */
          border-radius: 12px;

          /* keep your original border & shadow */
          border: 1px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .floating-nav:hover {
          background: rgba(255, 255, 255, 0.66);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.14);
        }

        @media (prefers-reduced-motion: reduce) {
          .floating-nav {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
