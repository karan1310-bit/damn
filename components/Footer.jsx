"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * SoftDropHero — #F0EBE6 bg, top-drop + settle, smooth pointer/touch repulsion
 * - Mobile tuned: fewer & smaller sprites
 * - Fixed-timestep physics (120Hz) + sleep to kill micro-jitter
 * - No external libs
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

    // Make bg exact from first paint (and if Tailwind purges arbitrary color)
    section.style.backgroundColor = BG;
    canvas.style.backgroundColor = BG;

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

      // paint immediately on resize to avoid any flash
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, W, H);

      // refresh responsive config on resize
      updateResponsiveConfig();
    };
    window.addEventListener("resize", fit);

    // ------- sprite -------
    const sprite = new window.Image();
    sprite.src = "/images/smiley.png";
    sprite.onload = () => setImgReady(true);

    // ------- physics (base values; some are overwritten by responsive config) -------
    const CONFIG = {
      PADDING: 12,
      G: 2100,          // gravity
      REST: 0.64,       // bounciness (slightly softer for less jitter)
      AIR: 0.012,       // global drag
      FLOOR_F: 0.16,    // floor friction (tangential damping)
      WALL_F: 0.08,     // wall friction
      MIN_R: 22,        // default; overwritten below
      MAX_R: 40,
      // sleep thresholds
      SLEEP_V: 5.5,     // below -> sleep
      WAKE_V: 18,       // strong bump wakes
      // pointer
      MOUSE_RADIUS: 160,
      MOUSE_FORCE: 1300,
      MOUSE_DAMP: 0.12,
      // target count bounds
      TARGET_MIN: 14,
      TARGET_MAX: 28,
    };

    // Responsive tuning (fewer/smaller on mobile)
    const updateResponsiveConfig = () => {
      const isMobile = W < 640;
      const isTablet = W >= 640 && W < 1024;

      if (isMobile) {
        CONFIG.MIN_R = 26;
        CONFIG.MAX_R = 30;
        CONFIG.MOUSE_RADIUS = 120;
        CONFIG.MOUSE_FORCE = 1100;
        CONFIG.TARGET_MIN = 10;
        CONFIG.TARGET_MAX = 16;
        CONFIG.G = 2000;
        CONFIG.REST = 0.6; // gentler bounces for small pieces
      } else if (isTablet) {
        CONFIG.MIN_R = 25;
        CONFIG.MAX_R = 36;
        CONFIG.MOUSE_RADIUS = 140;
        CONFIG.MOUSE_FORCE = 1200;
        CONFIG.TARGET_MIN = 20;
        CONFIG.TARGET_MAX = 28;
        CONFIG.G = 2050;
        CONFIG.REST = 0.62;
      } else {
        CONFIG.MIN_R = 30;
        CONFIG.MAX_R = 50;
        CONFIG.MOUSE_RADIUS = 160;
        CONFIG.MOUSE_FORCE = 1300;
        CONFIG.TARGET_MIN = 30;
        CONFIG.TARGET_MAX = 40;
        CONFIG.G = 2100;
        CONFIG.REST = 0.64;
      }
    };

    // init size + config
    fit();

    // ------- bodies / helpers -------
    const discs = [];
    const rand = (a, b) => a + Math.random() * (b - a);
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    const spawn = () => {
      const r = rand(CONFIG.MIN_R, CONFIG.MAX_R);
      const x = rand(CONFIG.PADDING + r, W - CONFIG.PADDING - r);
      const vx = rand(-70, 70);
      const vy = rand(-60, 0);
      discs.push({
        x,
        y: -r - rand(60, H * 0.6), // drop from above view
        vx,
        vy,
        r,
        m: r * r * Math.PI,
        sleeping: false,
      });
    };

    // elastic collision with gentle stabilization
    const collide = (a, b) => {
      const dx = b.x - a.x, dy = b.y - a.y;
      const dist = Math.hypot(dx, dy);
      const minDist = a.r + b.r;
      if (dist === 0 || dist >= minDist) return;

      const nx = dx / dist, ny = dy / dist;
      // mild positional correction (prevents overlaps, reduces jitter)
      const overlap = (minDist - dist) + 0.25;

      const total = a.m + b.m;
      const pushA = overlap * (b.m / total);
      const pushB = overlap * (a.m / total);
      a.x -= nx * pushA; a.y -= ny * pushA;
      b.x += nx * pushB; b.y += ny * pushB;

      // impulse along normal
      const rvx = b.vx - a.vx, rvy = b.vy - a.vy;
      const velN = rvx * nx + rvy * ny;
      if (velN > 0) return;

      const j = -(1 + CONFIG.REST) * velN / (1 / a.m + 1 / b.m);
      const ix = j * nx, iy = j * ny;
      a.vx -= ix / a.m; a.vy -= iy / a.m;
      b.vx += ix / b.m; b.vy += iy / b.m;

      // tiny tangent damping to kill buzz without making it sticky
      a.vx *= 0.999; b.vx *= 0.999;

      if (Math.hypot(a.vx, a.vy) > CONFIG.WAKE_V) a.sleeping = false;
      if (Math.hypot(b.vx, b.vy) > CONFIG.WAKE_V) b.sleeping = false;
    };

    // visible activation
    const activeRef = { current: false };
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (activeRef.current = e.isIntersecting)),
      { root: null, threshold: 0.12 }
    );
    io.observe(section);

    // pointer (repulsion)
    const mouse = { x: 0, y: 0, tx: 0, ty: 0, has: false };
    const handlePointerMove = (e) => {
      const rect = section.getBoundingClientRect();
      mouse.tx = e.clientX - rect.left;
      mouse.ty = e.clientY - rect.top;
      mouse.has = true;
      e.preventDefault();
    };
    const handleTouchMove = (e) => {
      const rect = section.getBoundingClientRect();
      const t = e.touches[0];
      mouse.tx = t.clientX - rect.left;
      mouse.ty = t.clientY - rect.top;
      mouse.has = true;
      e.preventDefault();
    };
    const handlePointerLeave = () => { mouse.has = false; };

    // let the headline be click-through so pointer hits the section
    section.addEventListener("pointermove", handlePointerMove, { passive: false });
    section.addEventListener("touchmove", handleTouchMove, { passive: false });
    section.addEventListener("pointerleave", handlePointerLeave);

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

      // responsive target count
      const area = (W * H) / (1000 * 600);
      const target = clamp(
        Math.round(CONFIG.TARGET_MIN + area * 6),
        CONFIG.TARGET_MIN,
        CONFIG.TARGET_MAX
      );

      // spawn while active and not yet full
      if (imgReady && activeRef.current && discs.length < target) {
        const toAdd = discs.length < Math.min(6, target) ? 2 : 1;
        for (let i = 0; i < toAdd; i++) spawn();
      }

      while (acc >= STEP) {
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
                d.sleeping = false;
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

            // floor
            const floorY = H - 2;
            if (d.y + d.r > floorY) {
              d.y = floorY - d.r;
              d.vy = -d.vy * CONFIG.REST;
              d.vx *= 1 - CONFIG.FLOOR_F;
            }

            // sleep when settled
            if (d.y + d.r >= floorY && Math.hypot(d.vx, d.vy) < CONFIG.SLEEP_V) {
              d.vx = 0; d.vy = 0; d.sleeping = true;
            }
          }
        }

        // collisions (two passes to de-jitter piles)
        for (let pass = 0; pass < 2; pass++) {
          for (let i = 0; i < discs.length; i++) {
            for (let j = i + 1; j < discs.length; j++) collide(discs[i], discs[j]);
          }
        }

        acc -= STEP;
      }

      // render
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, W, H);

      for (const d of discs) {
        if (imgReady) {
          ctx.save();
          ctx.translate(d.x, d.y);
          const s = (d.r * 2) / 256;
          ctx.scale(s, s);
          ctx.drawImage(sprite, -128, -128, 256, 256);
          ctx.restore();
        } else {
          // fallback: visible on light bg
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
          ctx.fillStyle = "#fff";
          ctx.fill();
          ctx.lineWidth = 3;
          ctx.strokeStyle = "#000";
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    // cleanup
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", fit);
      section.removeEventListener("pointermove", handlePointerMove);
      section.removeEventListener("touchmove", handleTouchMove);
      section.removeEventListener("pointerleave", handlePointerLeave);
      io.disconnect();
    };
  }, [imgReady]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate w-full text-neutral-900 overflow-hidden"
      style={{ backgroundColor: "#F0EBE6" }}
    >
      {/* Canvas */}
      <div className="absolute inset-0 -z-10" style={{ backgroundColor: "#F0EBE6" }}>
        <canvas ref={canvasRef} className="block h-full w-full" />
      </div>

      {/* Headline (click-through so pointer reaches section) */}
      <div className="relative mx-auto flex min-h-[80vh] items-center justify-center px-4 sm:px-6 lg:px-8 pointer-events-none">
        <h1 className="text-center font-DMbold text-2xl md:text-5xl tracking-tight leading-[0.95]">
          make some good shit happen
        </h1>
      </div>
    </section>
  );
}

