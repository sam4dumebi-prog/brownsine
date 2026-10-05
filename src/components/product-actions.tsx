"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ProductActions({
  productId,
  sellerId,
  loggedIn,
  isOwner,
  initialFavorited,
}: {
  productId: string;
  sellerId: string;
  loggedIn: boolean;
  isOwner: boolean;
  initialFavorited: boolean;
}) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [busy, setBusy] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [toast, setToast] = useState("");

  function requireLogin() {
    router.push("/login?next=/product/" + productId);
  }

  async function addToCart(redirectToCart = false) {
    if (!loggedIn) return requireLogin();
    setBusy(true);
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 }),
    });
    setBusy(false);
    if (res.ok) {
      if (redirectToCart) router.push("/cart");
      else {
        setToast("Added to cart!");
        setTimeout(() => setToast(""), 2000);
      }
    }
  }

  async function buyNow() {
    if (!loggedIn) return requireLogin();
    setBusy(true);
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 }),
    });
    setBusy(false);
    router.push("/checkout");
  }

  async function messageSeller() {
    if (!loggedIn) return requireLogin();
    setBusy(true);
    const res = await fetch("/api/messages/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: sellerId }),
    });
    const data = await res.json();
    setBusy(false);
    if (res.ok) router.push(`/messages?c=${data.id}&product=${productId}`);
  }

  async function toggleFavorite() {
    if (!loggedIn) return requireLogin();
    setBusy(true);
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    const data = await res.json();
    setBusy(false);
    if (res.ok) setFavorited(data.favorited);
  }

  function share() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: "Check this out on Okonjo Market", url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url);
      setToast("Link copied to clipboard!");
      setTimeout(() => setToast(""), 2000);
    }
  }

  async function submitReport(e: React.FormEvent) {
    e.preventDefault();
    if (!loggedIn) return requireLogin();
    await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetType: "product", targetId: productId, reason: reportReason }),
    });
    setReportOpen(false);
    setReportReason("");
    setToast("Report submitted. Our team will review it.");
    setTimeout(() => setToast(""), 3000);
  }

  return (
    <div className="space-y-3">
      {!isOwner && (
        <div className="grid grid-cols-2 gap-3">
          <button disabled={busy} onClick={buyNow} className="rounded-xl bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-60">
            Buy Now
          </button>
          <button disabled={busy} onClick={() => addToCart(false)} className="rounded-xl border border-green-600 py-3 text-sm font-bold text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950/30">
            Add to Cart
          </button>
        </div>
      )}
      <div className="grid grid-cols-3 gap-3">
        <button disabled={busy || isOwner} onClick={messageSeller} className="rounded-xl border border-slate-300 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
          💬 Message
        </button>
        <button onClick={toggleFavorite} className="rounded-xl border border-slate-300 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
          {favorited ? "❤️ Saved" : "🤍 Save"}
        </button>
        <button onClick={share} className="rounded-xl border border-slate-300 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
          🔗 Share
        </button>
      </div>
      {!isOwner && (
        <button onClick={() => setReportOpen((v) => !v)} className="text-xs font-medium text-red-500 hover:underline">
          🚩 Report this listing
        </button>
      )}
      {reportOpen && (
        <form onSubmit={submitReport} className="space-y-2 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/30">
          <textarea
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            required
            placeholder="Tell us what's wrong with this listing..."
            className="w-full rounded-lg border border-red-200 px-2 py-1.5 text-sm outline-none dark:border-red-900 dark:bg-slate-900"
          />
          <button className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700">Submit Report</button>
        </form>
      )}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-sm text-white shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}
