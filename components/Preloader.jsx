'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Preloader = () => {
  const refs = {
    container: useRef(null),
    initial: useRef(null),
    complete: useRef(null),
    percentage: useRef(null),
  };

  useGSAP(() => {
    const { container, initial, complete, percentage } = refs;

    const seen = sessionStorage.getItem('hasSeenPreloader');
    if (seen) {
      gsap.set(container.current, { display: 'none' });
      return;
    }

    gsap.set(initial.current, { opacity: 1, y: 0 });
    gsap.set(complete.current, { opacity: 0, y: 30 });

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem('hasSeenPreloader', 'true');
        container.current.style.display = 'none';
      },
    });

    tl.to('.progress-bar', {
      width: '100%',
      duration: 2,
      ease: 'power1.inOut',
      onUpdate() {
        if (percentage.current) {
          percentage.current.textContent = Math.round(this.progress() * 100);
        }
      },
    })
      .to(initial.current, {
        y: -30,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
      })
      .to(complete.current, {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
      })
      .to(container.current, {
        y: '-100vh',
        duration: 1,
        ease: 'power2.inOut',
        delay: 0.4,
      });
  }, []);

  return (
    <div
      ref={refs.container}
      className="preloader fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black font-satoshi"
    >
      
      <div className="progress-container flex flex-col items-center w-[80%] max-w-[300px] h-[1px] md:h-[2px] bg-black mb-4 relative">
        <div
        ref={refs.percentage}
        className="percentage text-[1rem] md:text-[1rem] mt-4 font-medium text-white/30 leading-[0.8]"
      >
        0
      </div>
        <div className="progress-bar absolute top-0 left-0 h-full w-0 bg-white/20" />
      </div>

      
    </div>
  );
};

export default Preloader;