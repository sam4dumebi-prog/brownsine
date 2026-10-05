"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { CATEGORIES } from "@/lib/categories";
import { useTheme } from "@/components/theme-provider";

const NIGERIAN_STATES = [
  "Lagos", "Abuja (FCT)", "Rivers", "Oyo", "Kano", "Enugu", "Delta", "Kaduna",
  "Ogun", "Anambra", "Edo", "Imo", "Akwa Ibom", "Plateau", "Cross River", "Osun",
];

type NavUser = { id: string; username: string; fullName: string; avatarUrl: string; role: string } | null;

const fetcher = (url: string) => fetch(url).then((r) => (r.ok ? r.json() : null));

export function Navbar({ user }: { user: NavUser }) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("All Nigeria");
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("okonjo-location");
    if (stored) setLocation(stored);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCategoriesOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const { data: cartData } = useSWR(user ? "/api/cart" : null, fetcher, { refreshInterval: 15000 });
  const { data: notifData } = useSWR(user ? "/api/notifications" : null, fetcher, { refreshInterval: 15000 });
  const { data: convoData } = useSWR(user ? "/api/messages/conversations" : null, fetcher, { refreshInterval: 15000 });

  const cartCount = cartData?.items?.reduce((sum: number, i: any) => sum + i.quantity, 0) ?? 0;
  const unreadNotifs = notifData?.items?.filter((n: any) => !n.isRead).length ?? 0;
  const unreadMessages = convoData?.items?.reduce((sum: number, c: any) => sum + c.unreadCount, 0) ?? 0;

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  }

  function selectLocation(state: string) {
    setLocation(state);
    window.localStorage.setItem("okonjo-location", state);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-green-600 text-lg font-bold text-white">O</span>
          <span className="hidden text-lg font-bold text-slate-900 sm:inline dark:text-white">Okonjo Market</span>
        </Link>

        <div className="relative hidden lg:block" ref={catRef}>
          <button
            onClick={() => setCategoriesOpen((v) => !v)}
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Categories <span className="text-xs">▾</span>
          </button>
          {categoriesOpen && (
            <div className="absolute left-0 mt-2 w-[560px] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl grid grid-cols-2 gap-1 animate-fade-in dark:border-slate-800 dark:bg-slate-900">
              {CATEGORIES.map((c) => (
                <Link
                  key={c.id}
                  href={`/category/${c.slug}`}
                  onClick={() => setCategoriesOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-green-50 hover:text-green-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <span className="text-lg">{c.icon}</span> {c.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={submitSearch} className="mx-1 flex flex-1 items-center gap-2">
          <div className="flex flex-1 items-center rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 focus-within:border-green-500 dark:border-slate-700 dark:bg-slate-900">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-slate-400">
              <path d="M21 21l-4.3-4.3m1.8-5.2a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full bg-transparent px-2 py-1 text-sm outline-none placeholder:text-slate-400 dark:text-white"
            />
          </div>
          <select
            value={location}
            onChange={(e) => selectLocation(e.target.value)}
            className="hidden shrink-0 rounded-full border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-600 outline-none md:block dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            <option>All Nigeria</option>
            {NIGERIAN_STATES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <button type="submit" className="hidden shrink-0 rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 sm:block">
            Search
          </button>
        </form>

        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="hidden shrink-0 rounded-full border border-slate-300 p-2 text-slate-600 hover:bg-slate-100 sm:grid dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        <Link
          href="/sell"
          className="hidden shrink-0 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-amber-600 md:block"
        >
          + Sell Something
        </Link>

        {user && (
          <>
            <Link href="/cart" className="relative hidden shrink-0 rounded-full p-2 text-slate-600 hover:bg-slate-100 sm:grid dark:text-slate-300 dark:hover:bg-slate-800">
              🛒
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link href="/messages" className="relative hidden shrink-0 rounded-full p-2 text-slate-600 hover:bg-slate-100 sm:grid dark:text-slate-300 dark:hover:bg-slate-800">
              💬
              {unreadMessages > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadMessages}
                </span>
              )}
            </Link>

            <div className="relative hidden shrink-0 sm:block" ref={notifRef}>
              <button onClick={() => setNotifOpen((v) => !v)} className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                🔔
                {unreadNotifs > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {unreadNotifs}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl animate-fade-in dark:border-slate-800 dark:bg-slate-900">
                  <p className="px-2 py-1 text-xs font-semibold uppercase text-slate-400">Notifications</p>
                  <div className="max-h-80 overflow-y-auto">
                    {(notifData?.items ?? []).length === 0 && (
                      <p className="px-2 py-4 text-center text-sm text-slate-400">No notifications yet.</p>
                    )}
                    {(notifData?.items ?? []).map((n: any) => (
                      <Link
                        key={n.id}
                        href={n.link || "#"}
                        onClick={() => setNotifOpen(false)}
                        className={`block rounded-lg px-2 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 ${!n.isRead ? "font-medium text-slate-900 dark:text-white" : "text-slate-500"}`}
                      >
                        {n.content}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {user ? (
          <div className="relative shrink-0" ref={profileRef}>
            <button onClick={() => setProfileOpen((v) => !v)} className="flex items-center gap-2 rounded-full border border-slate-300 p-1 pr-2 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
              <span className="grid h-7 w-7 place-items-center overflow-hidden rounded-full bg-green-600 text-xs font-bold text-white">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.username} className="h-full w-full object-cover" />
                ) : (
                  user.username.slice(0, 2).toUpperCase()
                )}
              </span>
              <span className="hidden text-sm font-medium text-slate-700 md:inline dark:text-slate-200">{user.username}</span>
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl animate-fade-in dark:border-slate-800 dark:bg-slate-900">
                <Link href={`/profile/${user.username}`} onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800">👤 My Profile</Link>
                <Link href="/dashboard" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800">📊 Seller Dashboard</Link>
                <Link href="/orders" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800">📦 My Orders</Link>
                <Link href="/saved" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800">❤️ Saved Items</Link>
                <Link href="/settings" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800">⚙️ Edit Profile</Link>
                {user.role === "admin" && (
                  <Link href="/admin" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800">🛡️ Admin Panel</Link>
                )}
                <button onClick={logout} className="mt-1 block w-full rounded-lg border-t border-slate-100 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:border-slate-800 dark:hover:bg-red-950/30">
                  🚪 Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <Link href="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">Log In</Link>
            <Link href="/signup" className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">Sign Up</Link>
          </div>
        )}

        <button onClick={() => setMobileOpen((v) => !v)} className="grid shrink-0 rounded-lg border border-slate-300 p-2 text-slate-600 lg:hidden dark:border-slate-700 dark:text-slate-300">
          ☰
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden dark:border-slate-800 dark:bg-slate-950">
          <div className="grid grid-cols-2 gap-2">
            {!user && (
              <>
                <Link href="/login" className="rounded-lg bg-slate-100 px-3 py-2 text-center text-sm font-semibold dark:bg-slate-800">Log In</Link>
                <Link href="/signup" className="rounded-lg bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white">Sign Up</Link>
              </>
            )}
            <Link href="/sell" className="col-span-2 rounded-lg bg-amber-500 px-3 py-2 text-center text-sm font-semibold text-white">+ Sell Something</Link>
            {user && (
              <>
                <Link href="/cart" className="rounded-lg bg-slate-100 px-3 py-2 text-center text-sm dark:bg-slate-800">🛒 Cart ({cartCount})</Link>
                <Link href="/messages" className="rounded-lg bg-slate-100 px-3 py-2 text-center text-sm dark:bg-slate-800">💬 Messages</Link>
              </>
            )}
            <button onClick={toggleTheme} className="col-span-2 rounded-lg bg-slate-100 px-3 py-2 text-center text-sm dark:bg-slate-800">
              {theme === "dark" ? "☀️ Light mode" : "🌙 Dark mode"}
            </button>
          </div>
          <p className="mt-3 mb-1 text-xs font-semibold uppercase text-slate-400">Categories</p>
          <div className="grid grid-cols-2 gap-1">
            {CATEGORIES.map((c) => (
              <Link key={c.id} href={`/category/${c.slug}`} className="rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
                {c.icon} {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
