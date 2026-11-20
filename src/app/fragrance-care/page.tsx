import Link from "next/link";

export const metadata = {
  title: "Fragrance care — AURELLE",
  description: "A considered guide to applying, wearing, and caring for fragrance.",
};

const careNotes = [
  { index: "01", title: "Start close", copy: "Apply to warm pulse points such as the wrists or base of the neck. One or two light sprays are a lovely place to begin." },
  { index: "02", title: "Let it settle", copy: "Give a fragrance a few moments to meet your skin. Avoid rubbing the application point; let the composition unfold at its own pace." },
  { index: "03", title: "Keep it out of the light", copy: "Store your bottle somewhere cool and dry, away from direct sun and sudden changes in temperature." },
  { index: "04", title: "Make it personal", copy: "Wear scent on its own or explore layering with an unscented moisturizer. Try a small amount first and see how it feels on you." },
];

export default function FragranceCarePage() {
  return (
    <>
      <section className="editorial-hero editorial-hero-care">
        <div className="container editorial-hero-inner">
          <p className="eyebrow">A considered guide</p>
          <h1 className="serif editorial-title">The art of<br /><em>wearing fragrance.</em></h1>
          <p className="editorial-lede">A few thoughtful notes for making a scent part of your everyday.</p>
          <span className="editorial-hero-mark" aria-hidden="true">02</span>
        </div>
      </section>
      <section className="container py-16 md:py-24">
        <div className="grid gap-px bg-white/10 md:grid-cols-2">
          {careNotes.map((note) => (
            <article key={note.index} className="care-note">
              <span className="serif text-4xl text-[#b49a68]">{note.index}</span>
              <h2 className="serif mt-8 text-3xl">{note.title}</h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-[#a9a49a]">{note.copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="border-y thin-rule bg-[#1d1c19]">
        <div className="container grid gap-8 py-16 md:grid-cols-[1fr_auto] md:items-center">
          <div><p className="eyebrow mb-3">A small reminder</p><h2 className="serif text-4xl">There is no perfect way to wear it.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-[#a9a49a]">Your skin, your day, your ritual. Let your own experience be the guide.</p></div>
          <Link className="button" href="/scent-finder">Find your fragrance ↗</Link>
        </div>
      </section>
    </>
  );
}
