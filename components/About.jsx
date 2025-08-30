'use client';

import Image from 'next/image';
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

export default function About() {
  const galleryRef = useRef(null);

  useLayoutEffect(() => {
    const mqReduce = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (mqReduce?.matches) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.polaroid');
      const badges = gsap.utils.toArray('.polaroid .badge');

      // perf hints
      gsap.set(cards, { willChange: 'transform', force3D: true });

      // badge reveal (opacity + translate only)
      gsap.set(badges, { autoAlpha: 0, y: 6 });
      cards.forEach((cardEl) => {
        const badge = cardEl.querySelector('.badge');
        if (!badge) return;
        const show = gsap.to(badge, { autoAlpha: 1, y: 0, duration: 0.22, ease: 'power3.out', paused: true });
        cardEl.addEventListener('mouseenter', () => show.play());
        cardEl.addEventListener('focusin', () => show.play());
        cardEl.addEventListener('mouseleave', () => show.reverse());
        cardEl.addEventListener('focusout', () => show.reverse());
      });

      // per-card amplitudes + followiness (no scale, just translate + rotateZ)
      const presets = [
        { dx: 36, dy: 22, rot: 6.0, follow: 0.18 }, // card 1 (more travel)
        { dx: 28, dy: 18, rot: -5.0, follow: 0.16 }, // card 2 (md+)
        { dx: 44, dy: 28, rot: 7.5, follow: 0.20 }, // card 3 (largest travel)
        { dx: 24, dy: 16, rot: -6.0, follow: 0.15 }, // card 4
      ];

      // frame-rate–independent smoothing helper
      const smooth = (baseFollow) => {
        const dt = gsap.ticker.deltaRatio(60);               // 60fps baseline
        return 1 - Math.pow(1 - baseFollow, dt);             // exponential smoothing
      };

      const states = cards.map((el, i) => {
        const p = presets[i] || presets[presets.length - 1];
        return {
          el,
          p,
          // physics state
          x: 0, y: 0, r: 0,
          tx: 0, ty: 0, tr: 0,
          active: false,
          // super-fast setters
          setX: gsap.quickSetter(el, 'x', 'px'),
          setY: gsap.quickSetter(el, 'y', 'px'),
          setR: gsap.quickSetter(el, 'rotateZ', 'deg'),
          rect: null,
        };
      });

      let running = false;
      const tick = () => {
        let anyMoving = false;
        for (const s of states) {
          const ease = smooth(s.p.follow);
          s.x += (s.tx - s.x) * ease;
          s.y += (s.ty - s.y) * ease;
          s.r += (s.tr - s.r) * ease;

          s.setX(s.x);
          s.setY(s.y);
          s.setR(s.r);

          // is the card still noticeably moving?
          if (Math.abs(s.tx - s.x) > 0.05 || Math.abs(s.ty - s.y) > 0.05 || Math.abs(s.tr - s.r) > 0.02) {
            anyMoving = true;
          }
        }
        if (!anyMoving) stop();
      };

      const start = () => {
        if (!running) {
          running = true;
          gsap.ticker.add(tick);
        }
      };
      const stop = () => {
        if (running) {
          running = false;
          gsap.ticker.remove(tick);
        }
      };

      const updateRect = (s) => { s.rect = s.el.getBoundingClientRect(); };

      // attach capsule physics per-card (only on hovered card)
      states.forEach((s) => {
        const onEnter = (ev) => {
          if (ev.pointerType === 'touch') return; // skip on touch
          updateRect(s);
          s.active = true;
          start();
          s.el.addEventListener('pointermove', onMove, { passive: true });
        };

        const onMove = (e) => {
          if (!s.rect) return;
          const nx = (e.clientX - (s.rect.left + s.rect.width / 2)) / s.rect.width;   // -0.5..0.5
          const ny = (e.clientY - (s.rect.top + s.rect.height / 2)) / s.rect.height;  // -0.5..0.5
          s.tx = nx * s.p.dx;
          s.ty = ny * s.p.dy;
          s.tr = (nx + ny) * s.p.rot;
        };

        const home = () => {
          // set targets to origin; ticker will glide them home smoothly
          s.tx = 0; s.ty = 0; s.tr = 0;
          s.active = false;
          start(); // ensure ticker runs until settled
        };

        const onLeave = () => {
          s.el.removeEventListener('pointermove', onMove);
          home();
        };

        s.el.addEventListener('pointerenter', onEnter, { passive: true });
        s.el.addEventListener('pointerleave', onLeave, { passive: true });
        s.el.addEventListener('pointercancel', onLeave, { passive: true });
        window.addEventListener('resize', () => updateRect(s), { passive: true });
      });

      return () => stop();
    }, galleryRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="flex items-center justify-center px-4 py-12 font-DMsemi">
      <div className="w-full max-w-5xl text-center">
        <h1 className="text-[clamp(2.2rem,6vw,4rem)] leading-[1.05] tracking-tight">
          we are , <span>internet kids</span> <br />
          team <span>with good taste</span> and
          <span className="relative inline-block italic font-Epiitalic ml-3 sm:ml-0">
            {' '}design delulu.
          </span>
        </h1>

        {/* ===== Gallery (exact sizes/overlap; transform-only motion) ===== */}
        <div
          ref={galleryRef}
          className="relative min-h-[40vh] md:min-h-[55vh] overflow-visible mx-auto mt-12 w-full"
        >
          <div className="relative flex flex-nowrap items-end justify-center gap-0 px-2 py-2">
            {/* Card 1 */}
            <article
              className="polaroid will-change-transform relative shrink-0 w-[140px] md:w-[240px] h-[180px] md:h-[300px] z-[3]"
              style={{ marginRight: '-10px' }}
            >
              <div className="relative md:mt-2 mx-auto h-full w-full rotate-[-8deg] overflow-hidden rounded-xl shadow-xl ring-1 ring-black/10">
                <Image
                  src="/me/3.jpg"
                  alt="yo"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 260px, 320px"
                  priority
                />
                <span className="badge absolute left-1 bottom-1 md:left-4 md:bottom-4 rounded-full bg-[#FFB6CE] px-1 md:px-3 py-1 text-[10px] sm:text-sm font-medium text-black shadow-sm">
                  waiting for coldplay!
                </span>
              </div>
            </article>

            {/* Card 2 (hidden on mobile) */}
            <article
              className="polaroid will-change-transform hidden md:block relative shrink-0 w-[120px] md:w-[240px] h-[200px] md:h-[310px] z-[2]"
              style={{ marginLeft: '-16px', marginRight: '-8px' }}
            >
              <div className="relative mx-auto mt-20 h-full w-full rotate-[6deg] overflow-hidden rounded-xl shadow-xl ring-1 ring-black/10">
                <Image
                  src="/me/8.jpg"
                  alt="Studio shoot"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 210px, 250px"
                />
                <span className="badge absolute left-1 bottom-2 rounded-full bg-[#FF7447] px-3 py-1 text-xs sm:text-sm font-semibold text-black shadow-sm">
                  wtf i'm doing here!
                </span>
              </div>
            </article>

            {/* Card 3 */}
            <article
              className="polaroid will-change-transform relative shrink-0 w-[140px] sm:w-[250px] md:w-[240px] h-[180px] sm:h-[280px] md:h-[310px] z-[4]"
              style={{ marginLeft: '-10px', marginRight: '-12px' }}
            >
              <div className="relative mx-auto mt-12 md:mt-0 h-full w-full rotate-[4deg] md:rotate-[-6deg] overflow-hidden rounded-xl shadow-xl ring-1 ring-black/10">
                <Image
                  src="/me/7.jpg"
                  alt="Campaign BTS"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 210px, 250px"
                />
                <span className="badge absolute left-3 top-1 md:left-4 md:top-4 rounded-full bg-[#82A0FF] px-3 py-1 text-[10px] sm:text-sm font-medium text-black shadow-sm">
                  on the top!!
                </span>
              </div>
            </article>

            {/* Card 4 */}
            <article
              className="polaroid will-change-transform relative shrink-0 w-[130px] sm:w-[250px] md:w-[240px] h-[180px] sm:h-[280px] md:h-[320px] z-[1]"
              style={{ marginLeft: '-14px' }}
            >
              <div className="relative mx-auto md:mt-16 h-full w-full rotate-[-12deg] md:rotate-[6deg] overflow-hidden rounded-xl shadow-xl ring-1 ring-black/10">
                <Image
                  src="/me/5.jpg"
                  alt="Awards night"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 200px, 240px"
                />
                <span className="badge absolute left-1 bottom-2 md:left-4 md:bottom-4 rounded-full bg-[#9BEB8A] px-3 py-1 text-[10px] sm:text-sm font-medium text-black shadow-sm">
                  carrying logs!
                </span>
              </div>
            </article>
          </div>
        </div>
        {/* ===== /Gallery ===== */}

        <p className="mt-12 md:mt-16 text-center font-DMregular text-md md:text-2xl text-neutral-800 max-w-xs md:max-w-5xl mx-auto leading-snug">
          a creative agency building bold brands and high-impact websites. From identity to execution, we blend design
          and dev to craft digital experiences that actually connect.
        </p>
      </div>
    </section>
  );
}
