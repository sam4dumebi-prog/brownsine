"use client";

import { useState } from "react";

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : [""];

  return (
    <div>
      <div className="aspect-square w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
        {list[active] ? (
          <img src={list[active]} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center text-6xl">🛍️</div>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((url, i) => (
            <button
              key={url}
              onClick={() => setActive(i)}
              className={`aspect-square overflow-hidden rounded-lg border-2 ${active === i ? "border-green-600" : "border-transparent"}`}
            >
              <img src={url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
