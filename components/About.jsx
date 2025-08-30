'use client';

import Image from 'next/image';
import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function About() {
  const rootRef = useRef(null);
  const galleryRef = useRef(null);

  useLayoutEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (reduce?.matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards  = gsap.utils.toArray('.polaroid');
      const badges = gsap.utils.toArray('.polaroid .badge');

      // ---- Initial states ----
      // (H1 / P: no masked states anymore; they stay as-is)
      gsap.set('.pop-in', { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%' });

      // Badge reveal (opacity + translate only)
      gsap.set(badges, { autoAlpha: 0, y: 6 });

      const badgeCleanups = [];
      cards.forEach((cardEl) => {
        const badge = cardEl.querySelector('.badge');
        if (!badge) return;
        const show = gsap.to(badge, { autoAlpha: 1, y: 0, duration: 0.22, ease: 'power3.out', paused: true });

        const onEnter = () => show.play();
        const onLeave = () => show.reverse();

        cardEl.addEventListener('mouseenter', onEnter);
        cardEl.addEventListener('focusin', onEnter);
        cardEl.addEventListener('mouseleave', onLeave);
        cardEl.addEventListener('focusout', onLeave);

        badgeCleanups.push(() => {
          cardEl.removeEventListener('mouseenter', onEnter);
          cardEl.removeEventListener('focusin', onEnter);
          cardEl.removeEventListener('mouseleave', onLeave);
          cardEl.removeEventListener('focusout', onLeave);
        });
      });

      // ---- Cards + decorative SVGs pop-in on view ----
      const popTl = gsap.timeline({
        defaults: { ease: 'back.out(1.6)' },
        scrollTrigger: { trigger: rootRef.current, start: 'top 60%', once: true },
      });
      popTl
        .to('.pop-in', { autoAlpha: 1, scale: 1, duration: 0.75, stagger: 0.18 }, 0)
        .to('.pop-in', { scale: 1.03, duration: 0.14, yoyo: true, repeat: 1, ease: 'power1.out' }, '-=0.2');

      // ---- Hover capsule physics (translate + tilt only; smooth) ----
      const presets = [
        { dx: 36, dy: 22, rot: 6.0, follow: 0.18 },
        { dx: 28, dy: 18, rot: -5.0, follow: 0.16 },
        { dx: 44, dy: 28, rot: 7.5, follow: 0.20 },
        { dx: 24, dy: 16, rot: -6.0, follow: 0.15 },
      ];
      const smooth = (base) => 1 - Math.pow(1 - base, gsap.ticker.deltaRatio(60));

      const states = cards.map((el, i) => {
        gsap.set(el, { willChange: 'transform', force3D: true });
        const p = presets[i] || presets[presets.length - 1];
        return {
          el, p,
          x: 0, y: 0, r: 0,
          tx: 0, ty: 0, tr: 0,
          rect: null,
          setX: gsap.quickSetter(el, 'x', 'px'),
          setY: gsap.quickSetter(el, 'y', 'px'),
          setR: gsap.quickSetter(el, 'rotateZ', 'deg'),
        };
      });

      let running = false;
      const tick = () => {
        let any = false;
        for (const s of states) {
          const e = smooth(s.p.follow);
          s.x += (s.tx - s.x) * e;
          s.y += (s.ty - s.y) * e;
          s.r += (s.tr - s.r) * e;
          s.setX(s.x); s.setY(s.y); s.setR(s.r);
          if (Math.abs(s.tx - s.x) > 0.05 || Math.abs(s.ty - s.y) > 0.05 || Math.abs(s.tr - s.r) > 0.02) any = true;
        }
        if (!any) stop();
      };
      const start = () => { if (!running) { running = true; gsap.ticker.add(tick); } };
      const stop  = () => { if (running)  { running = false; gsap.ticker.remove(tick); } };

      const physicsCleanups = [];
      states.forEach((s) => {
        const updateRect = () => { s.rect = s.el.getBoundingClientRect(); };
        const onEnter = (ev) => {
          if (ev.pointerType === 'touch') return;
          updateRect(); start();
          s.el.addEventListener('pointermove', onMove, { passive: true });
        };
        const onMove = (e) => {
          if (!s.rect) return;
          const nx = (e.clientX - (s.rect.left + s.rect.width / 2)) / s.rect.width;
          const ny = (e.clientY - (s.rect.top + s.rect.height / 2)) / s.rect.height;
          s.tx = nx * s.p.dx;
          s.ty = ny * s.p.dy;
          s.tr = (nx + ny) * s.p.rot;
        };
        const onLeave = () => {
          s.el.removeEventListener('pointermove', onMove);
          s.tx = 0; s.ty = 0; s.tr = 0; start();
        };

        s.el.addEventListener('pointerenter', onEnter,  { passive: true });
        s.el.addEventListener('pointerleave', onLeave,  { passive: true });
        s.el.addEventListener('pointercancel', onLeave, { passive: true });
        window.addEventListener('resize', updateRect,   { passive: true });

        physicsCleanups.push(() => {
          s.el.removeEventListener('pointerenter', onEnter);
          s.el.removeEventListener('pointerleave', onLeave);
          s.el.removeEventListener('pointercancel', onLeave);
          s.el.removeEventListener('pointermove', onMove);
          window.removeEventListener('resize', updateRect);
        });
      });

      // Cleanup
      return () => {
        badgeCleanups.forEach((fn) => fn());
        physicsCleanups.forEach((fn) => fn());
        stop();
        ScrollTrigger.kill(); // kill any triggers created in this context
      };
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="about" className="flex items-center bg-[#F0EBE6] justify-center px-4 py-12 font-DMsemi">
      <div className="w-full max-w-5xl text-center">
        {/* H1 (no scroll text animation; renders as-is) */}
        <h1 className="text-[clamp(2rem,5vw,3.7rem)] leading-[1.05] tracking-tight">
          Your brand's main character. turning viewers into devotees.
        </h1>

        {/* ===== Gallery ===== */}
        <div ref={galleryRef} className="relative min-h-[40vh] md:min-h-[55vh] overflow-visible mx-auto mt-16 w-full">
          {/* Decorative POPPING SVGs (pop-in on view) */}
          <div className="absolute hidden md:block ml-[70vw] md:ml-[60vw] z-6 pt-48 md:pt-0">
            <img src="/svg/camera.svg" className="pop-in h-20 w-20 md:h-40 md:w-40 rotate-12 md:-rotate-6" alt="Camera" />
          </div>
          <div className="absolute hidden md:block mr-[60vw] z-6 pt-64">
            <img src="/svg/fistbumb.svg" className="pop-in h-20 w-20 md:h-40 md:w-40 rotate-60" alt="Fist bump" />
          </div>

          <div className="relative flex flex-nowrap items-center justify-center gap-0 px-2 py-2">
            {/* Card 1 */}
            <article className="polaroid will-change-transform relative shrink-0 w-[140px] md:w-[240px] h-[180px] md:h-[280px] z-[3]" style={{ marginRight: '-10px' }}>
              <div className="pop-in relative md:mt-2 mx-auto h-full w-full rotate-[-7deg] overflow-hidden rounded-xl shadow-xl ring-1 ring-black/10">
                <Image src="/me/3.jpg" alt="yo" fill className="object-cover" sizes="(max-width: 768px) 260px, 320px" priority />
                <span className="badge absolute left-1 bottom-1 md:left-4 md:bottom-4 rounded-full bg-[#FFB6CE] px-1 md:px-3 py-1 text-[10px] sm:text-sm font-medium text-black shadow-sm">waiting for coldplay!</span>
              </div>
            </article>

            {/* Card 2 (hidden on mobile) */}
            <article className="polaroid will-change-transform hidden md:block relative shrink-0 w-[120px] md:w-[240px] h-[200px] md:h-[290px] z-[2]" style={{ marginLeft: '-16px', marginRight: '-8px' }}>
              <div className="pop-in relative mx-auto mt-20 h-full w-full rotate-[6deg] overflow-hidden rounded-xl shadow-xl ring-1 ring-black/10">
                <Image src="/me/8.jpg" alt="Studio shoot" fill className="object-cover object-top" sizes="(max-width: 768px) 210px, 250px" />
                <span className="badge absolute left-1 bottom-2 rounded-full bg-[#FF7447] px-3 py-1 text-xs sm:text-sm font-semibold text-black shadow-sm">wtf i'm doing here!</span>
              </div>
            </article>

            {/* Card 3 */}
            <article className="polaroid will-change-transform relative shrink-0 w-[140px] sm:w-[250px] md:w-[240px] h-[180px] sm:h-[280px] md:h-[280px] z-[4]" style={{ marginLeft: '-10px', marginRight: '-12px' }}>
              <div className="pop-in relative mx-auto mt-12 md:mt-0 h-full w-full rotate-[8deg] md:rotate-[-6deg] overflow-hidden rounded-xl shadow-xl ring-1 ring-black/10">
                <Image src="/me/7.jpg" alt="Campaign BTS" fill className="object-cover" sizes="(max-width: 768px) 210px, 250px" />
                <span className="badge absolute left-3 top-1 md:left-4 md:top-4 rounded-full bg-[#82A0FF] px-3 py-1 text-[10px] sm:text-sm font-medium text-black shadow-sm">on the top!!</span>
              </div>
            </article>

            {/* Card 4 */}
            <article className="polaroid will-change-transform relative shrink-0 w-[130px] sm:w-[250px] md:w-[240px] h-[180px] sm:h-[280px] md:h-[280px] z-[1]" style={{ marginLeft: '-14px' }}>
              <div className="pop-in relative mx-auto md:mt-16 h-full w-full rotate-[-5deg] md:rotate+[6deg] overflow-hidden rounded-xl shadow-xl ring-1 ring-black/10">
                <Image src="/me/5.jpg" alt="Awards night" fill className="object-cover" sizes="(max-width: 768px) 200px, 240px" />
                <span className="badge absolute left-1 bottom-2 md:left-4 md:bottom-4 rounded-full bg-[#9BEB8A] px-3 py-1 text-[10px] sm:text-sm font-medium text-black shadow-sm">carrying logs!</span>
              </div>
            </article>
          </div>
        </div>

        {/* Paragraph (no scroll text animation; renders as-is) */}
        <p className="mt-6 md:mt-16 text-center font-DMregular text-md md:text-2xl text-neutral-800 max-w-xs md:max-w-3xl mx-auto leading-snug">
          A design engineer making internet things that actually slap
          strategy first, pixels second, vibes always.
          <br className='md:hidden'/>need a launch-ready identity or a scroll-stopping landing? i’m your guy.
        </p>
      </div>
    </section>
  );
}
