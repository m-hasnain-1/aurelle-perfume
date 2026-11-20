"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { catalog } from "@/lib/catalog";
import { BottleArt } from "@/components/bottle-art";

const questions = [
  {
    title: "What kind of feeling are you looking for?",
    answers: [
      { label: "Bright and clear", detail: "A breath of fresh air", product: "eau-d-aube" },
      { label: "Warm and close", detail: "A softer kind of comfort", product: "solenne" },
      { label: "Deep and grounded", detail: "A quiet evening mood", product: "noctelle" },
    ],
  },
  {
    title: "Which notes draw you in?",
    answers: [
      { label: "Citrus and green", detail: "Lively, with room to breathe", product: "eau-d-aube" },
      { label: "Petals and spice", detail: "Soft bloom, subtle edge", product: "velours-rose" },
      { label: "Woods and amber", detail: "A little warmth that lingers", product: "solenne" },
    ],
  },
  {
    title: "When would you reach for it?",
    answers: [
      { label: "The everyday", detail: "Easy to make your own", product: "eau-d-aube" },
      { label: "A moment to pause", detail: "A little ritual, just for you", product: "solenne" },
      { label: "After the light softens", detail: "Something closer to dusk", product: "noctelle" },
    ],
  },
];

export default function ScentFinderPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const recommendation = useMemo(() => {
    const scores = answers.reduce<Record<string, number>>((result, id) => {
      result[id] = (result[id] || 0) + 1;
      return result;
    }, {});
    const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0];
    return catalog.find((product) => product.id === best) ?? catalog[0];
  }, [answers]);

  function choose(productId: string) {
    setAnswers((current) => [...current.slice(0, step), productId]);
    if (step === questions.length - 1) setFinished(true);
    else setStep((current) => current + 1);
  }

  function restart() {
    setStep(0);
    setAnswers([]);
    setFinished(false);
  }

  return (
    <div className="container min-h-[72vh] py-12 md:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow mb-4">A small study in you</p>
        <h1 className="serif text-5xl md:text-7xl">Find your note.</h1>
        <p className="mt-5 max-w-xl text-sm leading-7 text-[#a9a49a]">Three gentle prompts. No wrong answers. Just a place to begin.</p>
        <div className="mt-10 h-px bg-white/10" aria-hidden="true"><div className="h-px bg-[#b49a68] transition-all" style={{ width: `${finished ? 100 : (step / questions.length) * 100}%` }} /></div>
        {finished ? (
          <div className="mt-10 grid gap-8 md:grid-cols-[.8fr_1fr] md:items-center">
            <BottleArt tone={recommendation.imageTone} className="!min-h-[340px]" />
            <div>
              <p className="eyebrow mb-4">Your AURELLE starting point</p>
              <h2 className="serif text-5xl">{recommendation.name}</h2>
              <p className="mt-2 text-sm text-[#c5bdac]">{recommendation.tagline}</p>
              <p className="mt-5 text-sm leading-7 text-[#a9a49a]">{recommendation.description}</p>
              <p className="mt-5 text-xs uppercase tracking-[.12em] text-[#c8ae77]">{recommendation.topNotes} · {recommendation.heartNotes} · {recommendation.baseNotes}</p>
              <div className="mt-8 flex flex-wrap gap-3"><Link className="button button-solid" href={`/product/${recommendation.slug}`}>Meet {recommendation.name} ↗</Link><button className="button" type="button" onClick={restart}>Begin again</button></div>
              <p className="mt-5 text-xs text-[#827e75]">A suggestion, not a rule. Follow the notes that feel right.</p>
            </div>
          </div>
        ) : (
          <section className="mt-10" aria-live="polite">
            <p className="eyebrow">Question 0{step + 1} / 0{questions.length}</p>
            <h2 className="serif mt-3 text-3xl md:text-4xl">{questions[step].title}</h2>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {questions[step].answers.map((answer) => (
                <button key={answer.label} className="quiz-answer" type="button" onClick={() => choose(answer.product)}>
                  <span className="serif text-2xl">{answer.label}</span>
                  <span className="mt-3 text-xs leading-5 text-[#a9a49a]">{answer.detail}</span>
                  <span className="mt-7 text-[9px] uppercase tracking-[.18em] text-[#d1bd8c]">Choose this ↗</span>
                </button>
              ))}
            </div>
            {step > 0 && <button className="mt-7 text-[9px] uppercase tracking-[.16em] text-[#a9a49a] hover:text-white" type="button" onClick={() => { setStep((current) => current - 1); setAnswers((current) => current.slice(0, -1)); }}>← Previous question</button>}
          </section>
        )}
      </div>
    </div>
  );
}
