"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";

type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  family: string;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  imageTone: string;
  featured: boolean;
  archivedAt: string | null;
  variants: Array<{ id: string; sizeMl: number; priceCents: number; stock: number }>;
};
type AdminOrder = {
  id: string;
  email: string;
  status: string;
  subtotalCents: number;
  createdAt: string;
  items: Array<{ productName: string; sizeMl: number; quantity: number }>;
};

const blank = {
  slug: "", name: "", tagline: "", description: "", family: "Amber",
  topNotes: "", heartNotes: "", baseNotes: "",
  imageTone: "amber", featured: false, price30: "9200", stock30: "12",
  price75: "16800", stock75: "12",
};
const variantFields: Array<{
  label: string;
  priceKey: "price30" | "price75";
  stockKey: "stock30" | "stock75";
}> = [
  { label: "30 ml", priceKey: "price30", stockKey: "stock30" },
  { label: "75 ml", priceKey: "price75", stockKey: "stock75" },
];

export default function AdminPage() {
  const [code, setCode] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState(blank);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((response) => { if (response.ok) setAuthenticated(true); })
      .catch(() => setMessage("Studio connection unavailable."));
  }, []);

  const loadData = useCallback(async () => {
    const [productResponse, orderResponse] = await Promise.all([
      fetch("/api/admin/products"), fetch("/api/admin/orders"),
    ]);
    if (!productResponse.ok || !orderResponse.ok) throw new Error("Could not load studio data.");
    const [productData, orderData] = await Promise.all([productResponse.json(), orderResponse.json()]);
    setProducts(productData.products);
    setOrders(orderData.orders);
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    loadData().catch((error: unknown) => setMessage(error instanceof Error ? error.message : "Could not load studio data."));
  }, [authenticated, loadData]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/admin/session", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ code }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Access denied.");
      setAuthenticated(true);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not sign in.");
    } finally { setBusy(false); }
  }

  function edit(product: AdminProduct) {
    setSelectedId(product.id);
    setForm({
      slug: product.slug, name: product.name, tagline: product.tagline, description: product.description,
      topNotes: product.topNotes, heartNotes: product.heartNotes, baseNotes: product.baseNotes,
      family: product.family, imageTone: product.imageTone, featured: product.featured,
      price30: String(product.variants.find((variant) => variant.sizeMl === 30)?.priceCents ?? 9200),
      stock30: String(product.variants.find((variant) => variant.sizeMl === 30)?.stock ?? 0),
      price75: String(product.variants.find((variant) => variant.sizeMl === 75)?.priceCents ?? 16800),
      stock75: String(product.variants.find((variant) => variant.sizeMl === 75)?.stock ?? 0),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const payload = {
      slug: form.slug, name: form.name, tagline: form.tagline, description: form.description,
      topNotes: form.topNotes, heartNotes: form.heartNotes, baseNotes: form.baseNotes,
      family: form.family, imageTone: form.imageTone, featured: form.featured,
      variants: [
        { sizeMl: 30, priceCents: Number(form.price30), stock: Number(form.stock30) },
        { sizeMl: 75, priceCents: Number(form.price75), stock: Number(form.stock75) },
      ],
    };
    try {
      const response = await fetch(selectedId ? `/api/admin/products/${selectedId}` : "/api/admin/products", {
        method: selectedId ? "PUT" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not save product.");
      setMessage(selectedId ? "Product updated." : "Product created.");
      setSelectedId(""); setForm(blank); await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save product.");
    } finally { setBusy(false); }
  }

  async function archive(product: AdminProduct) {
    if (!window.confirm(`Archive ${product.name}? It will no longer be available to customers.`)) return;
    setBusy(true); setMessage("");
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not archive product.");
      setMessage(`${product.name} archived.`); await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not archive product.");
    } finally { setBusy(false); }
  }

  async function signOut() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthenticated(false); setProducts([]); setOrders([]); setCode("");
  }

  if (!authenticated) return (
    <div className="container min-h-[65vh] py-24">
      <p className="eyebrow mb-4">Private access</p><h1 className="serif text-6xl">The studio.</h1>
      <form className="mt-8 max-w-sm" onSubmit={signIn}>
        <label className="label" htmlFor="admin-code">Studio access code</label>
        <input id="admin-code" className="input" type="password" autoComplete="current-password" value={code} onChange={(event) => setCode(event.target.value)} required />
        {message && <p className="notice mt-4" role="alert">{message}</p>}
        <button className="button button-solid mt-5 w-full" disabled={busy}>{busy ? "Verifying…" : "Enter studio"}</button>
      </form>
      <p className="mt-5 max-w-sm text-xs leading-5 text-[#827e75]">Set ADMIN_ACCESS_CODE in your environment to enable studio access.</p>
    </div>
  );

  return (
    <div className="container min-h-[70vh] pb-24 pt-12">
      <div className="flex items-start justify-between gap-5"><div><p className="eyebrow mb-3">AURELLE</p><h1 className="serif text-6xl">The studio.</h1></div><button className="text-[9px] uppercase tracking-widest text-[#aaa59b] hover:text-white" onClick={signOut}>Sign out</button></div>
      {message && <p className="notice mt-6" role="status">{message}</p>}
      <section className="mt-10 border-y thin-rule py-8">
        <h2 className="serif mb-6 text-3xl">{selectedId ? "Edit fragrance" : "Create fragrance"}</h2>
        <form onSubmit={saveProduct} className="grid gap-4 md:grid-cols-2">
          <label><span className="label">Name</span><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required minLength={2} maxLength={80} /></label>
          <label><span className="label">Slug</span><input className="input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} required pattern="[a-z0-9-]+" /></label>
          <label><span className="label">Tagline</span><input className="input" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} required /></label>
          <label><span className="label">Scent family</span><select className="input" value={form.family} onChange={(e) => setForm({ ...form, family: e.target.value })}>{["Amber", "Woody", "Fresh", "Floral"].map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="md:col-span-2"><span className="label">Description</span><textarea className="input min-h-24" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required minLength={20} maxLength={2000} /></label>
          <label><span className="label">Opening notes</span><input className="input" value={form.topNotes} onChange={(e) => setForm({ ...form, topNotes: e.target.value })} required /></label>
          <label><span className="label">Heart notes</span><input className="input" value={form.heartNotes} onChange={(e) => setForm({ ...form, heartNotes: e.target.value })} required /></label>
          <label><span className="label">Base notes</span><input className="input" value={form.baseNotes} onChange={(e) => setForm({ ...form, baseNotes: e.target.value })} required /></label>
          <label><span className="label">Bottle tone</span><select className="input" value={form.imageTone} onChange={(e) => setForm({ ...form, imageTone: e.target.value })}>{["amber", "plum", "sage", "rose"].map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="flex items-center gap-3 text-xs"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured on the homepage</label>
          <div className="grid grid-cols-2 gap-4 md:col-span-2">
            {variantFields.map(({ label, priceKey, stockKey }) => (
              <fieldset key={label} className="border border-white/10 p-4"><legend className="px-2 text-xs text-[#b49a68]">{label}</legend>
                <label className="label">Price (cents)<input className="input" type="number" min="1000" max="100000" value={form[priceKey]} onChange={(e) => priceKey === "price30" ? setForm({ ...form, price30: e.target.value }) : setForm({ ...form, price75: e.target.value })} required /></label>
                <label className="label mt-3">Stock<input className="input" type="number" min="0" max="10000" value={form[stockKey]} onChange={(e) => stockKey === "stock30" ? setForm({ ...form, stock30: e.target.value }) : setForm({ ...form, stock75: e.target.value })} required /></label>
              </fieldset>
            ))}
          </div>
          <div className="flex gap-3 md:col-span-2"><button className="button button-solid" disabled={busy}>{busy ? "Saving…" : selectedId ? "Save changes" : "Create fragrance"}</button>{selectedId && <button type="button" className="button" onClick={() => { setSelectedId(""); setForm(blank); }}>Cancel</button>}</div>
        </form>
      </section>
      <section className="mt-12">
        <h2 className="serif mb-5 text-3xl">Fragrances <span className="text-lg text-[#827e75]">({products.length})</span></h2>
        <div className="divide-y divide-white/10 border-y border-white/10">{products.map((product) => <div key={product.id} className="flex flex-col justify-between gap-4 py-5 sm:flex-row sm:items-center"><div><p className="serif text-2xl">{product.name} {product.archivedAt && <span className="font-sans text-xs text-[#9b8060]">· archived</span>}</p><p className="mt-1 text-xs text-[#89857c]">{product.family} · {product.variants.map((variant) => `${variant.sizeMl} ml · $${(variant.priceCents / 100).toFixed(0)} (${variant.stock} in stock)`).join(" / ")}</p></div><div className="flex gap-4"><button className="text-[9px] uppercase tracking-widest hover:text-[#d1bd8c]" onClick={() => edit(product)}>Edit</button>{!product.archivedAt && <button className="text-[9px] uppercase tracking-widest text-[#a7866e] hover:text-white" onClick={() => archive(product)}>Archive</button>}</div></div>)}</div>
      </section>
      <section className="mt-14">
        <h2 className="serif mb-5 text-3xl">Recent orders <span className="text-lg text-[#827e75]">({orders.length})</span></h2>
        <div className="divide-y divide-white/10 border-y border-white/10">{orders.map((order) => <div className="flex flex-col justify-between gap-2 py-4 sm:flex-row" key={order.id}><div><p className="text-sm">{order.email} <span className="ml-2 text-[9px] uppercase tracking-widest text-[#b49a68]">{order.status}</span></p><p className="mt-1 text-xs text-[#827e75]">{order.items.map((item) => `${item.productName} ${item.sizeMl} ml × ${item.quantity}`).join(" · ")}</p></div><p className="text-sm">${(order.subtotalCents / 100).toFixed(2)} <span className="text-xs text-[#827e75]">· {new Date(order.createdAt).toLocaleDateString()}</span></p></div>)}</div>
      </section>
    </div>
  );
}
