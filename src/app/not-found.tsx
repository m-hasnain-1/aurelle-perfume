import Link from "next/link";

export default function NotFound() {
  return <div className="container min-h-[60vh] py-28"><p className="eyebrow mb-5">A note misplaced</p><h1 className="serif text-6xl">Not found.</h1><p className="mt-4 text-sm text-[#a9a49a]">This page has drifted away.</p><Link className="button mt-7" href="/shop">Return to the collection</Link></div>;
}
