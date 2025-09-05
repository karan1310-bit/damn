'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Deffect from './Deffect';
import Effect from './Effect';

export default function GetInTouch() {
  const [time, setTime] = useState('');

  // — Local time (updates every minute)
  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZoneName: 'short',
      }).format(new Date());
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 60_000);
    return () => clearInterval(id);
  }, []);

  const scrollTop = () => {
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      aria-labelledby="get-in-touch-title"
      className="relative overflow-hidden bg-[#F0EBE6] text-[#080807] font-DMsemi"
    >

      <div className="mx-auto max-w-9xl px-6 md:px-14">
        {/* Mini heading */}
        <p className="pt-8 md:pt-16 text-center text-xl sm:text-2xl tracking-wide font-semibold text-black/60">
          Need an unfair advantage?
        </p>

        {/* Hero Title */}
        <div className="relative mt-2 sm:mt-3">
          <h1
            id="get-in-touch-title"
            className="relative z-10 text-center font-DMbold uppercase leading-[0.96] tracking-[-0.02em]
                       text-[20vw] md:text-[10vw]"
          >
            GET IN TOUCH
          </h1>
        </div>

        {/* 3-column lists */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 md:gap-10 mt-8 md:mt-12 lg:gap-14">
              {/* Left: get in touch */}
              <div className="lg:col-span-6 text-center md:text-left">
                <p className="hidden md:block text-left text-base md:text-lg text-neutral-600 mb-2">contact</p>
                <Link
                  href="mailto:contact.sleekframe@gmail.com?subject=Quick%2010-min%20call%20about%20my%20project&body=Hi%20SleekFrame%2C%20I%20just%20saw%20your%20work%20and%20loved%20it.%20I%27d%20love%20to%20book%20a%2010-minute%20call%20to%20discuss%20my%20project.%20Thanks!"
                  className="block text-[5vw] sm:text-[6vw] lg:text-[2rem] text-neutral-900 font-DMsemi tracking-tight hover:opacity-90"
                >
                  <span className="relative inline-block pr-2 border-b-2">
                    contact.karan131@gmail.com
                    {/* Animated underline */}
                   
                  </span>
                </Link>
              </div>

              {/* Right: link columns */}
              <nav className="lg:col-span-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-6 text-base md:text-lg leading-7">
                  <ul className="md:space-y-1 font-DMregular">
                    <li>
                      <Deffect title="Home" link="#home" />
                    </li>
                    <li>
                      <Deffect title="Services" link="#services" />
                    </li>
                    <li>
                      <Deffect title="About" link="#about" />
                    </li>
                    <li>
                      <Deffect title="Work" link="#work" />
                    </li>
                    
                  </ul>

                  <ul className="text-right md:text-left md:space-y-1 font-DMregular">
                    <li>
                      <Effect title="Instagram" link="https://www.instagram.com/sleekframestudios?igsh=MWI3enl0a2dneHhucA%3D%3D" />
                    </li>
                    <li>
                      <Effect title="WhatsApp" link="https://wa.me/+917225928721?text=Hi%20SleekFrame%2C%20I%20just%20saw%20your%20work%20and%20loved%20it.%20I%27d%20love%20to%20book%20a%2010-minute%20call%20to%20discuss%20my%20project." />
                    </li>
                  
                    <li>
                      <Effect title="LinkedIn" link="https://www.linkedin.com/company/sleekframestudios/" />
                    </li>
                    <li>
                      <Effect title="GitHub" link="https://github.com/sleekframestudios" />
                    </li>
                    
                  </ul>

                  <ul className="hidden md:block md:space-y-1 font-DMregular">
                    <li>
                      <Effect title="+91 7225928721" link="mailto:contact.sleekframe@gmail.com" />
                    </li>
                    <li>
                      <Effect title="Ujjain, India" link="mailto:contact.sleekframe@gmail.com" />
                    </li>
                    {/* add more if needed */}
                  </ul>
                </div>
              </nav>
            </div>

        {/* Bottom row: Copyright & Local time */}
        <div className="relative z-10 mt-16 md:mt-12 pb-4 sm:pb-8">
          <div className="flex gap-2 md:gap-0 items-start md:items-end justify-between">
            {/* Copyright */} 
            <div className="select-none">
              <p className="text-[16px] sm:text-[16px] text-black/60 font-DMsemi leading-none">
                © 2025 Karan
              </p>
              <p className="mt-1 text-[14px] text-black/60 sm:text-[15px]">all right reserved</p>
            </div>

            {/* Local time */}
            <div className="text-left sm:text-right">
              <p className="hidden md:block text-[16px] tracking-[0.18em] text-black/60">
                Local Time
              </p>
              <p className="mt-0 text-[14px] text-black/60 sm:text-[15px]">{time}</p>
            </div>
          </div>
          
        </div>
      </div>

      
    </section>
  );
}
