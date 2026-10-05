"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { formatNaira, timeAgo } from "@/lib/money";

export type ProductCardData = {
  id: string;
  title: string;
  price: string;
  condition: string;
  location: string;
  status: string;
  featured: boolean;
  viewsCount: number;
  createdAt: string;
  coverImage: string | null;
  seller: { id: string; username: string; avatarUrl: string; verified: boolean };
  favorited?: boolean;
};

export function ProductCard({ product, canFavorite = true }: { product: ProductCardData; canFavorite?: boolean }) {
  const [favorited, setFavorited] = useState(product.favorited ?? false);
  const [busy, setBusy] = useState(false);

  async function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      const data = await res.json();
      setFavorited(data.favorited);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Link
      href={`/product/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        {product.coverImage ? (
          <Image
            src={product.coverImage}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-4xl">🛍️</div>
        )}
        {product.featured && (
          <span className="absolute left-2 top-2 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white shadow">
            Featured
          </span>
        )}
        <span className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
          {product.condition}
        </span>
        {canFavorite && (
          <button
            onClick={toggleFavorite}
            aria-label="Save product"
            className="absolute bottom-2 right-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-lg shadow hover:scale-110 dark:bg-slate-900/90"
          >
            {favorited ? "❤️" : "🤍"}
          </button>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="line-clamp-2 min-h-[2.5rem] text-sm font-medium text-slate-800 dark:text-slate-100">{product.title}</p>
        <p className="text-lg font-bold text-green-700 dark:text-green-400">{formatNaira(product.price)}</p>
        <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="line-clamp-1">📍 {product.location}</span>
          <span>{timeAgo(product.createdAt)}</span>
        </div>
        <div className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
          <span className="grid h-4 w-4 place-items-center overflow-hidden rounded-full bg-green-600 text-[9px] font-bold text-white">
            {product.seller.avatarUrl ? (
              <img src={product.seller.avatarUrl} className="h-full w-full object-cover" alt="" />
            ) : (
              product.seller.username.slice(0, 1).toUpperCase()
            )}
          </span>
          <span className="line-clamp-1">{product.seller.username}</span>
          {product.seller.verified && <span title="Verified seller">✅</span>}
        </div>
      </div>
    </Link>
  );
}
