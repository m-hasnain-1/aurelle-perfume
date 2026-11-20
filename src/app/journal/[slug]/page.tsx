import Link from "next/link";
import { notFound } from "next/navigation";
import { journalArticles } from "@/lib/journal";

export function generateStaticParams() {
  return journalArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = journalArticles.find((item) => item.slug === slug);
  return { title: article ? `${article.title} — AURELLE Journal` : "Journal — AURELLE" };
}

export default async function JournalArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = journalArticles.find((item) => item.slug === slug);
  if (!article) notFound();
  return (
    <article>
      <header className={`journal-article-hero ${article.tone}`}>
        <div className="container max-w-4xl py-20 md:py-32">
          <Link className="eyebrow hover:text-white" href="/journal">← The journal</Link>
          <p className="eyebrow mt-12">{article.category} · {article.readTime}</p>
          <h1 className="serif mt-5 max-w-3xl text-6xl leading-[.9] md:text-8xl">{article.title}</h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-[#c2bbae]">{article.dek}</p>
        </div>
      </header>
      <div className="container max-w-2xl py-16 md:py-24">
        <p className="serif mb-10 border-l border-[#b49a68] pl-6 text-2xl italic leading-relaxed text-[#d3c7ac]">A small note from the AURELLE journal.</p>
        {article.paragraphs.map((paragraph) => <p className="mb-7 text-[15px] leading-8 text-[#b9b4a9]" key={paragraph}>{paragraph}</p>)}
        <div className="mt-14 border-t thin-rule pt-8"><p className="eyebrow mb-4">Continue the journey</p><div className="flex flex-wrap gap-3"><Link className="button" href="/journal">More from the journal</Link><Link className="button" href="/shop">Explore the collection</Link></div></div>
      </div>
    </article>
  );
}
