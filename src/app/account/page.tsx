import Link from "next/link";

export default function AccountPage() {
  return <div className="container min-h-[65vh] pb-24 pt-20"><p className="eyebrow mb-4">AURELLE, to you</p><h1 className="serif text-6xl">Your account.</h1><div className="mt-8 max-w-xl border-y thin-rule py-8"><h2 className="serif text-3xl">A more personal ritual.</h2><p className="mt-4 text-sm leading-7 text-[#a9a49a]">Account sign-in and order history are a demo feature and are not enabled in this storefront. Checkout is available as a guest, and your order confirmation is sent by Stripe after payment.</p><Link className="button mt-7" href="/shop">Discover your fragrance</Link></div></div>;
}
