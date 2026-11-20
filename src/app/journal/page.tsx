import Link from "next/link";
import { journalArticles } from "@/lib/journal";

export const metadata = {
  title: "The journal — AURELLE",
  description: "Notes on fragrance, composition, and the small rituals in between.",
};

export default function JournalPage() {
  return (
    <>
      <section className="editorial-hero editorial-hero-journal">
        <div className="container editorial-hero-inner">
          <p className="eyebrow">The AURELLE journal</p>
          <h1 className="serif editorial-title">Notes on scent.<br /><em>And everything around it.</em></h1>
          <p className="editorial-lede">A collection of thoughts on composition, memory, and the small rituals in between.</p>
          <span className="editorial-hero-mark" aria-hidden="true">№</span>
        </div>
      </section>
      <section className="container py-16 md:py-24">
        <div className="mb-9 flex items-end justify-between border-b thin-rule pb-5">
          <div><p className="eyebrow mb-2">From the journal</p><h2 className="serif text-4xl">Take a moment.</h2></div>
          <span className="hidden text-[9px] uppercase tracking-[.16em] text-[#827e75] sm:block">AURELLE · Vol. 01</span>
        </div>
        <div className="grid gap-x-6 gap-y-12 md:grid-cols-3">
          {journalArticles.map((article, index) => (
            <article key={article.slug}>
              <Link href={`/journal/${article.slug}`} className="journal-card">
                <span className="eyebrow">{article.category}</span>
                <span className="journal-card-number serif">0{index + 1}</span>
                <span className="serif relative z-10 mt-auto text-3xl leading-tight">{article.title}</span>
                <span className="relative z-10 mt-3 text-sm leading-6 text-[#c0b9ab]">{article.dek}</span>
                <span className="relative z-10 mt-6 text-[9px] uppercase tracking-[.16em] text-[#d1bd8c]">{article.readTime} · Read story ↗</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
