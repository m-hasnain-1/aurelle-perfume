import Link from "next/link";

export const metadata = {
  title: "Frequently asked — AURELLE",
  description: "Answers about the AURELLE fragrance collection and this demo store.",
};

const questions = [
  { question: "How do I find a fragrance to start with?", answer: "Try the scent finder for a recommendation based on the notes and moods you are drawn to, or browse all four compositions in the collection." },
  { question: "How should I apply fragrance?", answer: "Begin with one or two light sprays on warm pulse points. Let the scent settle on your skin rather than rubbing it in." },
  { question: "How long does a fragrance last?", answer: "Wear time varies with the composition, your skin, and the day. The sample descriptions are fictional and this demo makes no performance guarantee." },
  { question: "Can I place a real order here?", answer: "No. This is a demonstration storefront. Stripe is intended for test mode, and shipping, tax, returns, and fulfillment are not connected." },
  { question: "Can I create an account?", answer: "Account sign-in and order history are not implemented. The account page explains the guest-checkout demo." },
  { question: "Where can orders be shipped?", answer: "The configured test checkout accepts the United States, Canada, United Kingdom, France, and Germany. It does not create actual shipments." },
];

export default function FAQPage() {
  return (
    <div className="container min-h-[70vh] max-w-4xl py-16 md:py-24">
      <p className="eyebrow mb-4">A few useful notes</p>
      <h1 className="serif text-6xl md:text-7xl">Frequently asked.</h1>
      <p className="mt-5 max-w-xl text-sm leading-7 text-[#a9a49a]">A little clarity on fragrance, finding your note, and the limits of this demo store.</p>
      <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
        {questions.map((item, index) => (
          <details className="faq-item" key={item.question}>
            <summary><span className="eyebrow mr-5">0{index + 1}</span><span className="serif text-2xl">{item.question}</span><span className="faq-plus" aria-hidden="true">+</span></summary>
            <p className="ml-12 max-w-2xl pb-7 pr-10 text-sm leading-7 text-[#a9a49a]">{item.answer}</p>
          </details>
        ))}
      </div>
      <div className="mt-12 flex flex-wrap gap-3"><Link className="button" href="/scent-finder">Find your scent</Link><Link className="button" href="/shipping-returns">Shipping & returns</Link></div>
    </div>
  );
}
