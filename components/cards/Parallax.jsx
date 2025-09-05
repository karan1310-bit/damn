'use client';

import { useRef } from 'react';
import { projects } from './data';
import Card from './Card';

export default function Parallax() {
  const container = useRef(null);

  return (
    <section className="w-full">
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-8 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          <span className="lowercase">call me if you </span>
          <span className="italic relative">
            need
            <span className="absolute left-0 -bottom-1 h-[3px] w-full bg-black/80 rounded-full" />
          </span>
        </h2>
      </div>

      <main ref={container} className="relative mt-[0vh] w-full">
        {projects.map((project, i) => {
          const { key: reactKey, ...cardProps } = project; // don't spread `key`
          return <Card key={reactKey ?? `p_${i}`} i={i} {...cardProps} />;
        })}
      </main>
    </section>
  );
}
