
export default function About() {

  return (
    <section id='about' className="flex items-center font-DMsemi justify-center px-4 py-12">
      <div className="max-w-5xl text-center">
        <h1
          className="text-[clamp(2.2rem,6vw,4rem)] leading-[1.05] font-DMsemi tracking-tight"
        >
          we are{' '}
          , <span className="">internet kids</span> <br />
          team <span className="">with good taste</span>{' '} and
          <span className="relative inline-block italic font-Epiitalic ml-3 sm:ml-0">
             design delulu.
          </span>{' '}
        </h1>

        <p className="mt-12 md:mt-10 text-center font-DMregular text-md md:text-2xl text-neutral-800 max-w-xs md:max-w-5xl mx-auto leading-snug">
  a creative agency building bold brands and high-impact websites. From identity to execution, we blend design and dev to craft digital experiences that actually connect.
</p>
      </div>
    </section>
  );
}
