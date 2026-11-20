import Link from "next/link";

export const metadata = {
  title: "Our world — AURELLE",
  description: "The point of view, small rituals, and considered compositions behind AURELLE.",
};

const principles = [
  { index: "I", title: "Begin with a feeling", copy: "Every composition starts with a moment we want to hold onto: the air just after rain, the last light in a room, the calm of coming home." },
  { index: "II", title: "Leave room to breathe", copy: "We build each fragrance with contrast and space. Notes should meet one another gently, then leave space for the person wearing them." },
  { index: "III", title: "Make the everyday matter", copy: "Luxury need not wait for an occasion. A considered scent can make an ordinary morning feel unmistakably your own." },
];

export default function OurWorldPage() {
  return (
    <>
      <section className="editorial-hero">
        <div className="container editorial-hero-inner">
          <p className="eyebrow">The house of AURELLE</p>
          <h1 className="serif editorial-title">A little less noise.<br /><em>A little more meaning.</em></h1>
          <p className="editorial-lede">We make fragrance for the parts of a day that belong only to you.</p>
          <span className="editorial-hero-mark" aria-hidden="true">A</span>
        </div>
      </section>
      <section className="container grid gap-12 py-20 md:grid-cols-[.65fr_1.35fr] md:gap-24 md:py-32">
        <p className="eyebrow">A point of view</p>
        <div className="max-w-3xl">
          <h2 className="serif text-4xl leading-tight md:text-5xl">Fragrance is not an entrance.<br />It is a way of being present.</h2>
          <p className="mt-8 text-sm leading-8 text-[#aaa59b]">AURELLE was imagined around a simple idea: the things we choose to wear can bring us back to ourselves. Not louder, not different—just a little more here.</p>
          <p className="mt-5 text-sm leading-8 text-[#aaa59b]">Our fictional fragrance house follows that thought through every detail. From the first impression to the last trace on a sleeve, each composition is an invitation to slow down and notice.</p>
        </div>
      </section>
      <section className="border-y thin-rule bg-[#1d1c19]">
        <div className="container py-20 md:py-28">
          <p className="eyebrow mb-5">The things we return to</p>
          <div className="grid gap-px bg-white/10 md:grid-cols-3">
            {principles.map((principle) => (
              <article className="bg-[#1d1c19] px-7 py-9 md:px-10 md:py-12" key={principle.index}>
                <span className="serif text-4xl text-[#b49a68]">{principle.index}</span>
                <h2 className="serif mt-10 text-3xl">{principle.title}</h2>
                <p className="mt-4 text-sm leading-7 text-[#a9a49a]">{principle.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="container grid gap-10 py-20 md:grid-cols-2 md:items-center md:py-32">
        <div className="world-monogram"><span className="serif italic">a</span><span className="world-monogram-caption">AURELLE · SCENT, CONSIDERED</span></div>
        <div className="max-w-lg">
          <p className="eyebrow mb-5">A practice, not a performance</p>
          <h2 className="serif text-5xl leading-[.98]">Wear the moment<br />you are in.</h2>
          <p className="mt-6 text-sm leading-7 text-[#a9a49a]">A fragrance becomes personal through time: the way it warms on skin, the hour you reach for it, the memory it quietly gathers. We leave room for that part to be yours.</p>
          <Link className="button mt-8" href="/journal">Read the AURELLE journal ↗</Link>
        </div>
      </section>
    </>
  );
}
