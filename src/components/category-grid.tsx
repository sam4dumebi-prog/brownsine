import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-7">
      {CATEGORIES.map((c) => (
        <Link
          key={c.id}
          href={`/category/${c.slug}`}
          className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:border-green-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <span className="text-3xl transition group-hover:scale-110">{c.icon}</span>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{c.name}</span>
        </Link>
      ))}
    </div>
  );
}
