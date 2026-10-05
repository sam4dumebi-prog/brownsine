"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { CATEGORIES } from "@/lib/categories";

export function SellForm() {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id);
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState<"new" | "used">("used");
  const [location, setLocation] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [deliveryOptions, setDeliveryOptions] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    const formData = new FormData();
    Array.from(files).slice(0, 8 - images.length).forEach((f) => formData.append("files", f));
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) {
      setError(data.error ?? "Upload failed.");
      return;
    }
    setImages((prev) => [...prev, ...data.urls].slice(0, 8));
    if (fileInput.current) fileInput.current.value = "";
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((u) => u !== url));
  }

  function toggleDelivery(option: string) {
    setDeliveryOptions((prev) => (prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (images.length === 0) {
      setError("Please upload at least one product image.");
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        categoryId,
        price: Number(price),
        condition,
        location,
        quantity: Number(quantity),
        deliveryOptions: deliveryOptions.join(", "),
        images,
      }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error ?? "Failed to publish listing.");
      return;
    }
    router.push(`/product/${data.id}`);
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div>
        <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">Product Images (up to 8)</label>
        <div className="mt-2 flex flex-wrap gap-3">
          {images.map((url) => (
            <div key={url} className="relative h-24 w-24 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button type="button" onClick={() => removeImage(url)} className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-black/60 text-xs text-white">✕</button>
            </div>
          ))}
          {images.length < 8 && (
            <label className="grid h-24 w-24 cursor-pointer place-items-center rounded-xl border-2 border-dashed border-slate-300 text-xs text-slate-400 hover:border-green-500 hover:text-green-600 dark:border-slate-700">
              {uploading ? "Uploading..." : "+ Add photo"}
              <input ref={fileInput} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
            </label>
          )}
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">Product Name</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required minLength={3} placeholder="e.g. iPhone 13 Pro Max 256GB"
          className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-green-500 dark:border-slate-700 dark:bg-slate-800" />
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required minLength={10} rows={4} placeholder="Describe your product's condition, features, and any accessories included."
          className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-green-500 dark:border-slate-700 dark:bg-slate-800" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">Category</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-green-500 dark:border-slate-700 dark:bg-slate-800">
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">Price (₦)</label>
          <input type="number" min={1} value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="150000"
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-green-500 dark:border-slate-700 dark:bg-slate-800" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">Condition</label>
          <div className="mt-1 flex gap-2">
            {(["new", "used"] as const).map((c) => (
              <button type="button" key={c} onClick={() => setCondition(c)}
                className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium capitalize ${condition === c ? "border-green-600 bg-green-50 text-green-700 dark:bg-green-950/40" : "border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">Location</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} required placeholder="e.g. Lagos, Nigeria"
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-green-500 dark:border-slate-700 dark:bg-slate-800" />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">Quantity</label>
          <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-green-500 dark:border-slate-700 dark:bg-slate-800" />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">Delivery Options</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {["Pickup", "Same-day delivery", "Nationwide delivery", "Inspection before payment"].map((opt) => (
            <button type="button" key={opt} onClick={() => toggleDelivery(opt)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${deliveryOptions.includes(opt) ? "border-green-600 bg-green-50 text-green-700 dark:bg-green-950/40" : "border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300"}`}>
              {opt}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40">{error}</p>}

      <button disabled={submitting || uploading} className="w-full rounded-xl bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-60">
        {submitting ? "Publishing..." : "Publish Listing"}
      </button>
    </form>
  );
}
