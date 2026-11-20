import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t thin-rule bg-[#131311]">
      <div className="container grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="text-lg tracking-[.3em]">AURELLE</Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-[#a9a49a]">Scent, considered. Composed slowly, worn your way.</p>
        </div>
        <div className="space-y-3 text-xs text-[#bdb8ae]">
          <p className="eyebrow mb-5">Discover</p>
          <Link className="block hover:text-white" href="/shop">The collection</Link>
          <Link className="block hover:text-white" href="/scent-finder">Find your scent</Link>
          <Link className="block hover:text-white" href="/discovery">Discover AURELLE</Link>
          <Link className="block hover:text-white" href="/journal">The journal</Link>
        </div>
        <div className="space-y-3 text-xs text-[#bdb8ae]">
          <p className="eyebrow mb-5">The house</p>
          <Link className="block hover:text-white" href="/our-world">Our world</Link>
          <Link className="block hover:text-white" href="/fragrance-care">Fragrance care</Link>
          <Link className="block hover:text-white" href="/account">Your account</Link>
        </div>
        <div className="space-y-3 text-xs text-[#bdb8ae]">
          <p className="eyebrow mb-5">Here to help</p>
          <Link className="block hover:text-white" href="/faq">Frequently asked</Link>
          <Link className="block hover:text-white" href="/shipping-returns">Shipping & returns</Link>
          <Link className="block hover:text-white" href="/admin">Studio access</Link>
        </div>
      </div>
      <div className="container flex flex-col justify-between gap-3 border-t thin-rule py-5 text-[9px] uppercase tracking-[.16em] text-[#827e75] md:flex-row">
        <span>© 2026 AURELLE PARFUMS</span><span>Made for moments that are yours.</span>
      </div>
    </footer>
  );
}
