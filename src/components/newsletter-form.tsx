"use client";

import { useState, type FormEvent } from "react";

export function NewsletterForm() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setBusy(true);
    setMessage("");
    const form = new FormData(formElement);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: form.get("email") }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We couldn't save your subscription.");
      setMessage("You’re on the list. We’ll be in touch.");
      formElement.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <form className="mx-auto mt-9 flex max-w-lg flex-col gap-3 sm:flex-row" onSubmit={submit}>
        <label htmlFor="newsletter-email" className="sr-only">Email address</label>
        <input id="newsletter-email" name="email" type="email" required maxLength={254} placeholder="Your email address" className="input flex-1" />
        <button className="button button-solid" type="submit" disabled={busy}>{busy ? "One moment…" : "Keep me close"}</button>
      </form>
      {message && <p className="mt-4 text-sm text-[#d0bf98]" role="status">{message}</p>}
    </>
  );
}
