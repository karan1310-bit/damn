"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * SoftDropHero v2.2 (final anti-vibe)
 * - Hard sleep on floor with stay-still frames
 * - Velocity-dependent floor bounce: tiny hits don't bounce
 * - Micro velocity clamp + exact floor snap
 * - Keeps previous scroll + footer behavior
 */
export default function SoftDropHero() {
  const BG = "#F0EBE6";

  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const [imgReady, setImgReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    section.style.backgroundColor = BG;
    const ctx = canvas.getContext("2d", { alpha: true });

    // ------- sizing / DPR -------
    let W = 0, H = 0;
    const fit = () => {
      W = section.clientWidth;
      H = Math.max(520, Math.min(900, Math.round(window.innerHeight * 0.8)));

      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, W, H);

      updateResponsiveConfig();
    };
    window.addEventListener("resize", fit, { passive: true });

    // ------- sprite -------
    const sprite = new window.Image();
    sprite.src = "/images/smiley.png";
    sprite.onload = () => setImgReady(true);

    // ------- physics base config -------
    const CONFIG = {
      PADDING: 12,
      G_BASE: 2100, // baseline gravity; eased by scroll
      G: 2100,
      REST: 0.6,
      AIR: 0.02,
      FLOOR_F: 0.22,
      WALL_F: 0.12,
      MIN_R: 22,
      MAX_R: 40,
      // sleep thresholds
      SLEEP_V: 8.0,
      WAKE_V: 28,
      // static floor friction thresholds
      FLOOR_STATIC_VX: 14,
      FLOOR_STATIC_VY: 18,
      // collision impulse suppression
      WEAK_IMPULSE_VN: 10,
      // pointer
      MOUSE_RADIUS: 160,
      MOUSE_FORCE: 1300,
      MOUSE_DAMP: 0.12,
      // target count bounds
      TARGET_MIN: 14,
      TARGET_MAX: 28,
      // NEW: hard-sleep tuning
      SMALL_BOUNCE_VY: 45,   // if |vy| < this on floor hit, no bounce
      MICRO_VX: 4,           // clamp tiny lateral drift to zero
      SLEEP_FRAMES: 14,      // frames below thresholds before hard-sleep
      FLOOR_EPS: 0.75        // snap tolerance for floor sticking
    };

    const updateResponsiveConfig = () => {
      const isMobile = W < 640;
      const isTablet = W >= 640 && W < 1024;

      if (isMobile) {
        CONFIG.MIN_R = 27;
        CONFIG.MAX_R = 35;
        CONFIG.MOUSE_RADIUS = 110;
        CONFIG.MOUSE_FORCE = 1050;
        CONFIG.TARGET_MIN = 16;
        CONFIG.TARGET_MAX = 20;
        CONFIG.G_BASE = 2000;
        CONFIG.REST = 0.6;
      } else if (isTablet) {
        CONFIG.MIN_R = 25;
        CONFIG.MAX_R = 36;
        CONFIG.MOUSE_RADIUS = 140;
        CONFIG.MOUSE_FORCE = 1200;
        CONFIG.TARGET_MIN = 18;
        CONFIG.TARGET_MAX = 26;
        CONFIG.G_BASE = 2050;
        CONFIG.REST = 0.62;
      } else {
        CONFIG.MIN_R = 35;
        CONFIG.MAX_R = 60;
        CONFIG.MOUSE_RADIUS = 160;
        CONFIG.MOUSE_FORCE = 1300;
        CONFIG.TARGET_MIN = 24;
        CONFIG.TARGET_MAX = 36;
        CONFIG.G_BASE = 2100;
        CONFIG.REST = 0.64;
      }

      CONFIG.G = CONFIG.G_BASE;
    };

    // init size + config
    fit();

    // ------- helpers & state -------
    const discs = [];
    const rand = (a, b) => a + Math.random() * (b - a);
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);

    const spawn = () => {
      const r = rand(CONFIG.MIN_R, CONFIG.MAX_R);
      const x = rand(CONFIG.PADDING + r, W - CONFIG.PADDING - r);
      const vx = rand(-60, 60);
      const vy = rand(-50, 0);
      discs.push({
        x,
        y: -r - rand(60, H * 0.6),
        vx,
        vy,
        r,
        m: r * r * Math.PI,
        sleeping: false,
        grounded: false,
        stillFrames: 0,     // NEW: counts frames of near-zero motion on floor
      });
    };

    // collision (stabilized)
    const collide = (a, b) => {
      // Skip resolving if both are asleep
      if (a.sleeping && b.sleeping) return;

      const dx = b.x - a.x, dy = b.y - a.y;
      const dist = Math.hypot(dx, dy);
      const minDist = a.r + b.r;
      if (dist === 0 || dist >= minDist) return;

      const nx = dx / dist, ny = dy / dist;
      const overlap = (minDist - dist) + 0.1;

      const total = a.m + b.m;
      const pushA = overlap * (b.m / total);
      const pushB = overlap * (a.m / total);
      a.x -= nx * pushA; a.y -= ny * pushA;
      b.x += nx * pushB; b.y += ny * pushB;

      // relative normal velocity
      const rvx = b.vx - a.vx, rvy = b.vy - a.vy;
      const velN = rvx * nx + rvy * ny;

      // Gentle contact -> bleed energy, no impulse
      if (velN > -CONFIG.WEAK_IMPULSE_VN) {
        a.vx *= 0.998; b.vx *= 0.998;
        a.vy *= 0.998; b.vy *= 0.998;
        return;
      }

      const j = -(1 + CONFIG.REST) * velN / (1 / a.m + 1 / b.m);
      const ix = j * nx, iy = j * ny;
      a.vx -= ix / a.m; a.vy -= iy / a.m;
      b.vx += ix / b.m; b.vy += iy / b.m;

      a.vx *= 0.999; b.vx *= 0.999;

      if (Math.hypot(a.vx, a.vy) > CONFIG.WAKE_V) a.sleeping = false;
      if (Math.hypot(b.vx, b.vy) > CONFIG.WAKE_V) b.sleeping = false;
    };

    // visibility gate
    const activeRef = { current: false };
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (activeRef.current = e.isIntersecting)),
      { root: null, threshold: 0.1 }
    );
    io.observe(section);

    // pointer — passive (keeps scroll free on mobile)
    const mouse = { x: 0, y: 0, tx: 0, ty: 0, has: false };
    const handlePointerMove = (e) => {
      const rect = section.getBoundingClientRect();
      mouse.tx = e.clientX - rect.left;
      mouse.ty = e.clientY - rect.top;
      mouse.has = true;
    };
    const handlePointerLeave = () => { mouse.has = false; };

    section.addEventListener("pointermove", handlePointerMove, { passive: true });
    section.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    // scroll progress drives gravity & spawn target
    const scroll = { progress: 0 };
    const updateScrollProgress = () => {
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight || document.documentElement.clientHeight;
      const total = rect.height || 1;
      const start = Math.min(viewH, Math.max(0, viewH - rect.top));
      const raw = total <= 0 ? 0 : clamp((start + Math.min(0, rect.top)) / total, 0, 1);

      scroll.progress = clamp(raw, 0, 1);
      const gEase = easeOutCubic(scroll.progress);
      CONFIG.G = CONFIG.G_BASE * (0.6 + 0.8 * gEase); // 60% -> 140%
    };

    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress, { passive: true });

    // ------- animation -------
    let raf = 0, prev = performance.now(), acc = 0;
    const STEP = 1 / 120;

    const loop = (t) => {
      const dt = Math.min(0.04, (t - prev) / 1000);
      prev = t;
      acc += dt;

      // smooth pointer easing
      if (mouse.has) {
        mouse.x += (mouse.tx - mouse.x) * CONFIG.MOUSE_DAMP;
        mouse.y += (mouse.ty - mouse.y) * CONFIG.MOUSE_DAMP;
      }

      // responsive target by area
      const area = (W * H) / (1000 * 600);
      const baseTarget = clamp(
        Math.round(CONFIG.TARGET_MIN + area * 6),
        CONFIG.TARGET_MIN,
        CONFIG.TARGET_MAX
      );
      const spawnTarget = Math.round(
        baseTarget * (0.2 + 0.8 * easeOutCubic(scroll.progress))
      );

      // spawn while active and under target
      if (imgReady && activeRef.current && discs.length < spawnTarget) {
        const deficit = spawnTarget - discs.length;
        const toAdd = Math.min(deficit, discs.length < Math.min(6, spawnTarget) ? 2 : 1);
        for (let i = 0; i < toAdd; i++) spawn();
      }

      while (acc >= STEP) {
        const floorY = H - 2;

        for (const d of discs) {
          if (!d.sleeping) {
            // gravity & drag
            d.vy += CONFIG.G * STEP;
            d.vx *= 1 - CONFIG.AIR;
            d.vy *= 1 - CONFIG.AIR;

            // pointer repulsion
            if (mouse.has) {
              const dx = d.x - mouse.x, dy = d.y - mouse.y;
              const dist = Math.hypot(dx, dy);
              if (dist < CONFIG.MOUSE_RADIUS + d.r) {
                const influence = 1 - dist / (CONFIG.MOUSE_RADIUS + d.r);
                const nx = dx / (dist || 1), ny = dy / (dist || 1);
                const f = CONFIG.MOUSE_FORCE * influence * STEP;
                d.vx += nx * f; d.vy += ny * f;
              }
            }

            // integrate
            d.x += d.vx * STEP;
            d.y += d.vy * STEP;

            // walls
            if (d.x - d.r < CONFIG.PADDING) {
              d.x = CONFIG.PADDING + d.r;
              d.vx = -d.vx * CONFIG.REST;
              d.vy *= 1 - CONFIG.WALL_F;
            }
            if (d.x + d.r > W - CONFIG.PADDING) {
              d.x = W - CONFIG.PADDING - d.r;
              d.vx = -d.vx * CONFIG.REST;
              d.vy *= 1 - CONFIG.WALL_F;
            }

            // floor contact (final anti-vibration)
            d.grounded = false;
            if (d.y + d.r > floorY - CONFIG.FLOOR_EPS) {
              // Snap cleanly to floor and mark grounded
              d.y = floorY - d.r;
              d.grounded = true;

              // Velocity-dependent bounce: ignore tiny impacts
              if (Math.abs(d.vy) < CONFIG.SMALL_BOUNCE_VY) {
                d.vy = 0;
              } else {
                d.vy = -d.vy * CONFIG.REST;
              }

              // Friction + micro clamp
              d.vx *= (1 - CONFIG.FLOOR_F);
              if (Math.abs(d.vx) < CONFIG.MICRO_VX) d.vx = 0;

              // Hard-sleep after several still frames
              const speed = Math.hypot(d.vx, d.vy);
              if (speed < CONFIG.SLEEP_V) d.stillFrames++;
              else d.stillFrames = 0;

              if (d.stillFrames >= CONFIG.SLEEP_FRAMES) {
                d.vx = 0; d.vy = 0;
                d.sleeping = true;
                // snap exactly once more to be safe
                d.y = floorY - d.r;
              }
            } else {
              // in-air: reset counter
              d.stillFrames = 0;
            }
          }
        }

        // collisions — 3 passes for stable stacks
        for (let pass = 0; pass < 3; pass++) {
          for (let i = 0; i < discs.length; i++) {
            const a = discs[i];
            for (let j = i + 1; j < discs.length; j++) collide(a, discs[j]);
          }
        }

        acc -= STEP;
      }

      // render
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, W, H);

      for (const d of discs) {
        // soft shadow
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.10)";
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = d.grounded ? 2 : 1;

        if (imgReady) {
          ctx.translate(d.x, d.y);
          const s = (d.r * 2) / 256;
          ctx.scale(s, s);
          ctx.drawImage(sprite, -128, -128, 256, 256);
        } else {
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
          ctx.fillStyle = "#fff";
          ctx.fill();
          ctx.lineWidth = 3;
          ctx.strokeStyle = "#000";
          ctx.stroke();
        }
        ctx.restore();
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    // cleanup
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", fit);
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", updateScrollProgress);
      section.removeEventListener("pointermove", handlePointerMove);
      section.removeEventListener("pointerleave", handlePointerLeave);
      io.disconnect();
    };
  }, [imgReady]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate w-full text-neutral-900 overflow-visible"
      style={{ backgroundColor: "#F0EBE6", touchAction: "pan-y" }}
    >
      {/* Canvas layer (80vh area) */}
      <div className="relative block w-full" style={{ height: "80vh", backgroundColor: "#F0EBE6" }}>
        <canvas ref={canvasRef} className="block h-full w-full" aria-hidden="true" />

        {/* Headline (pointer-through so section gets pointer events) */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8 mb-16 sm:mb-0">
          <h1 className="text-center font-DMbold text-3xl md:text-5xl tracking-tight leading-[0.95]">
            Let's make some good shit.
          </h1>
        </div>

        {/* Bottom fade into footer */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#F0EBE6]" />
      </div>

      {/* Footer band placeholder (30vh) */}
     <div className="relative z-10 h-[20vh] bg-gradient-to-b from-[#F0EBE6] via-[#F0EBE6] to-[#F0EBE6]">
  <div className="h-full px-4 sm:px-6 lg:px-8 flex items-end">
    <footer className="w-full pb-6 text-neutral-800/80" role="contentinfo">
      <div className="flex flex-col w-full gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Copyright */}
        <div className="text-sm md:text-lg">
          <span className="font-DMsemi">
            © {new Date().getFullYear()} Karan Portfolio
          </span>
          <span className="hidden sm:inline"> · All rights reserved.</span>
        </div>

         {/* Right: Socials + To top */}
        <div className="flex items-center gap-3">
          {/* GitHub */}
          <a
            href="https://github.com/yourhandle"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="p-2 rounded-xl hover:bg-black/5 transition"
            title="GitHub"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.262.82-.582 0-.287-.01-1.044-.015-2.05-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.744.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.304 3.492.997.108-.776.42-1.304.763-1.604-2.665-.304-5.466-1.333-5.466-5.93 0-1.31.468-2.382 1.236-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23.96-.267 1.987-.4 3.008-.404 1.02.005 2.047.138 3.007.404 2.29-1.552 3.298-1.23 3.298-1.23.652 1.652.241 2.873.117 3.176.769.838 1.235 1.91 1.235 3.22 0 4.61-2.807 5.624-5.48 5.92.432.372.816 1.104.816 2.226 0 1.606-.014 2.898-.014 3.293 0 .323.217.701.825.58C20.565 21.796 24 17.297 24 12 24 5.37 18.63 0 12 0Z"/>
            </svg>
          </a>

          {/* X (Twitter) */}
          <a
            href="https://x.com/yourhandle"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter)"
            className="p-2 rounded-xl hover:bg-black/5 transition"
            title="X"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M3 2h5.2l5.08 6.9L18.8 2H22l-7.9 10.1L21.5 22h-5.2l-5.3-7.2L5.1 22H2l8.3-10.6L3 2z"/>
            </svg>
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com/yourhandle"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="p-2 rounded-xl hover:bg-black/5 transition"
            title="Instagram"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4.2" fill="#F0EBE6"/>
              <circle cx="17.2" cy="6.8" r="1.4" />
            </svg>
          </a>

          {/* Mail */}
          <a
            href="mailto:hello@sleekframestudios.com"
            aria-label="Email"
            className="p-2 rounded-xl hover:bg-black/5 transition"
            title="Email"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v.35l-10 6.25L2 6.35V6z"/>
              <path d="M2 8.11V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8.11l-9.58 5.98a2 2 0 0 1-2.08 0L2 8.11z"/>
            </svg>
          </a>

         
        </div>

        {/* Center: Nav */}
        <nav className="order-last sm:order-none">
          <ul className="flex items-center gap-6 text-sm md:text-lg font-DMmedium">
            <li><a href="/#services" className="hover:opacity-100 opacity-80 transition">Services</a></li>
            <li><a href="/work" className="hover:opacity-100 opacity-80 transition">Work</a></li>
            <li><a href="/" className="hover:opacity-100 opacity-80 transition">Home</a></li>
            <li><a href="/about" className="hover:opacity-100 opacity-80 transition">About</a></li>
          </ul>
        </nav>

        {/* To top */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="ml-2 inline-flex items-center justify-center rounded-full border border-black/10 px-3 py-2 text-sm font-medium hover:bg-black/5 transition"
            aria-label="Back to top"
            title="Back to top"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </button>
      </div>
    </footer>
  </div>
</div>

    </section>
  );
}
