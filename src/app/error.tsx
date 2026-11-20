"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="container min-h-[60vh] py-28"><p className="eyebrow mb-5">A pause in the ritual</p><h1 className="serif text-5xl">We couldn’t open this page.</h1><p className="mt-4 text-sm text-[#a9a49a]">Please try again in a moment.</p><button className="button mt-7" onClick={reset}>Try again</button></div>;
}
