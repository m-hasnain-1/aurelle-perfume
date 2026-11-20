import Link from "next/link";
import { catalog } from "@/lib/catalog";
import { BottleViewer } from "@/components/bottle-viewer";
import { ProductCard } from "@/components/product-card";
import { NewsletterForm } from "@/components/newsletter-form";
import { journalArticles } from "@/lib/journal";

export default function HomePage() {
  return (
    <>
      <section className="hero-glow relative overflow-hidden">
        <div className="container grid min-h-[760px] items-center gap-6 py-10 md:min-h-[720px] md:gap-8 md:py-14 md:grid-cols-[.9fr_1.1fr]">
          <div className="relative z-10 order-1 max-w-[500px] md:order-1">
            <p className="eyebrow mb-7">A study in what stays</p>
            <h1 className="serif text-[clamp(3.8rem,8vw,7.2rem)] leading-[.84] tracking-[-.035em]">Scent,<br /><em className="font-normal text-[#c2ac7d]">considered.</em></h1>
            <p className="mt-8 max-w-sm text-sm leading-7 text-[#b8b2a7]">Quietly distinctive fragrances, composed slowly and made to be lived in.</p>
            <Link href="/shop" className="button mt-9">Discover the collection <span aria-hidden="true">↗</span></Link>
            <div className="mt-10 flex items-center gap-3 text-[9px] uppercase tracking-[.18em] text-[#979187]">
              <span className="h-px w-9 bg-[#b49a68]" />
              A quieter kind of signature
            </div>
          </div>
          <div className="relative order-2 h-[350px] md:order-2 md:h-[570px]">
            <div className="absolute inset-0">
              <BottleViewer tone="amber" />
            </div>
            <div className="pointer-events-none absolute bottom-10 left-5 text-left">
              <span className="eyebrow">The signature scent</span>
              <p className="serif mt-1 text-2xl">Solenne</p>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-[calc(100%-64px)] -translate-x-1/2 bg-white/10" />
      </section>

      <section className="container section-space">
        <div className="mb-12 flex items-end justify-between gap-5">
          <div><p className="eyebrow mb-4">The collection</p><h2 className="serif text-5xl md:text-6xl">Made to linger.</h2></div>
          <Link className="hidden border-b border-[#74674d] pb-2 text-[9px] uppercase tracking-[.16em] md:block" href="/shop">Meet all four fragrances ↗</Link>
        </div>
        <div className="product-grid product-grid-home">
          {catalog.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
        <Link className="button mt-10 md:hidden" href="/shop">Explore the collection ↗</Link>
      </section>

      <section className="border-y thin-rule bg-[#1d1c19]">
        <div className="container py-20 md:py-28">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="eyebrow mb-4">A fragrance, in three acts</p>
            <h2 className="serif text-5xl leading-[.95] md:text-6xl">The first impression<br />is only the beginning.</h2>
            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#aaa59b]">AURELLE scents unfold close to the skin: bright at first, beautifully present in the middle, and quietly remembered.</p>
          </div>
          <div className="grid gap-px bg-white/10 md:grid-cols-3">
            {[
              { number: "01", name: "The opening", note: "A first breath of light.", copy: "Fresh notes meet the air and invite you in." },
              { number: "02", name: "The heart", note: "The feeling takes shape.", copy: "Floral, green, or softly spiced—each composition finds its own center." },
              { number: "03", name: "The lasting note", note: "A little stays with you.", copy: "Warm woods and gentle musks leave a personal, intimate trail." },
            ].map((act) => (
              <article key={act.number} className="bg-[#1d1c19] px-7 py-8 md:px-10 md:py-11">
                <span className="serif text-4xl text-[#b49a68]">{act.number}</span>
                <p className="eyebrow mt-7">{act.name}</p>
                <h3 className="serif mt-3 text-3xl">{act.note}</h3>
                <p className="mt-4 max-w-xs text-sm leading-6 text-[#969188]">{act.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="our-world" className="border-y thin-rule bg-[#1d1c19]">
        <div className="container grid items-center gap-12 py-24 md:grid-cols-[1fr_1fr] md:gap-20 md:py-36">
          <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden bg-[radial-gradient(ellipse,rgba(180,154,104,.16),transparent_60%)]">
            <div className="absolute h-64 w-64 rounded-full border border-[#b49a68]/20" />
            <div className="absolute h-48 w-48 rounded-full border border-[#b49a68]/20" />
            <div className="absolute h-32 w-32 rounded-full border border-[#b49a68]/20" />
            <span className="serif relative text-5xl italic text-[#d0bf98]">aurelle</span>
            <span className="absolute bottom-8 text-[9px] uppercase tracking-[.22em] text-[#858076]">Composed with intention</span>
          </div>
          <div className="max-w-md">
            <p className="eyebrow mb-5">A slower kind of luxury</p>
            <h2 className="serif text-5xl leading-[.98] md:text-6xl">The art is in<br />what we leave out.</h2>
            <p className="mt-7 text-sm leading-7 text-[#aaa59b]">We believe a fragrance should become part of your story, not speak over it. Every AURELLE composition begins with a single feeling, then makes room for everything else.</p>
            <p className="mt-7 text-[10px] uppercase tracking-[.18em] text-[#d1bd8c]">Thoughtfully made · Intentionally worn</p>
          </div>
        </div>
      </section>

      <section className="container py-20 md:py-28">
        <div className="grid gap-10 md:grid-cols-[.75fr_1.25fr] md:items-end">
          <div>
            <p className="eyebrow mb-4">Make it your own</p>
            <h2 className="serif text-5xl leading-[.95] md:text-6xl">Choose by<br />feeling.</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[#a9a49a]">There is no wrong way to wear a fragrance. Start with the note you’re drawn to, then let the rest become yours.</p>
        </div>
        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {[
            { title: "Warm & enveloping", note: "Amber · iris · golden light", product: "solenne", tone: "amber", number: "01" },
            { title: "Quiet & grounded", note: "Black tea · fig · cedar", product: "noctelle", tone: "plum", number: "02" },
            { title: "Bright & unhurried", note: "Bergamot · green leaves · musk", product: "eau-d-aube", tone: "sage", number: "03" },
          ].map((mood) => (
            <Link key={mood.product} href={`/product/${mood.product}`} className={`mood-card ${mood.tone}`}>
              <span className="eyebrow">{mood.number} · Find your note</span>
              <span className="serif mt-auto text-3xl">{mood.title}</span>
              <span className="mt-2 text-xs text-[#c0b9ab]">{mood.note}</span>
              <span className="mt-7 text-[9px] uppercase tracking-[.18em] text-[#d1bd8c]">Explore fragrance ↗</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y thin-rule bg-[#b49a68] text-[#171715]">
        <div className="container grid gap-8 py-11 text-center sm:grid-cols-3 sm:text-left">
          <div><p className="serif text-2xl">Wear it your way</p><p className="mt-1 text-xs text-[#332f27]">Made for skin, made for you.</p></div>
          <div><p className="serif text-2xl">A little discovery</p><p className="mt-1 text-xs text-[#332f27]">A sample vial with every order.</p></div>
          <div><p className="serif text-2xl">Thoughtful delivery</p><p className="mt-1 text-xs text-[#332f27]">Complimentary over $150.</p></div>
        </div>
      </section>

      <section className="container py-20 md:py-28">
        <div className="mb-9 flex items-end justify-between gap-5">
          <div><p className="eyebrow mb-3">From the journal</p><h2 className="serif text-5xl">A few quiet thoughts.</h2></div>
          <Link className="hidden border-b border-[#74674d] pb-2 text-[9px] uppercase tracking-[.16em] sm:block" href="/journal">Read all notes ↗</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {journalArticles.map((article, index) => (
            <Link className={`journal-card !min-h-[300px] ${article.tone}`} href={`/journal/${article.slug}`} key={article.slug}>
              <span className="eyebrow">{article.category}</span>
              <span className="journal-card-number serif">0{index + 1}</span>
              <span className="serif relative z-10 mt-auto text-3xl leading-tight">{article.title}</span>
              <span className="relative z-10 mt-3 text-sm leading-6 text-[#c0b9ab]">{article.dek}</span>
              <span className="relative z-10 mt-6 text-[9px] uppercase tracking-[.16em] text-[#d1bd8c]">Read story ↗</span>
            </Link>
          ))}
        </div>
        <Link className="button mt-7 sm:hidden" href="/journal">Read all notes ↗</Link>
      </section>

      <section className="container py-24 text-center md:py-32">
        <p className="eyebrow mb-5">Letters from AURELLE</p>
        <h2 className="serif text-5xl">A little more presence.</h2>
        <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-[#a9a49a]">Occasional notes on scent, process, and the moments in between. No noise, just the good things.</p>
        <NewsletterForm />
        <p className="mt-4 text-[10px] text-[#77736c]">By subscribing, you agree to receive occasional AURELLE updates.</p>
      </section>
    </>
  );
}
