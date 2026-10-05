"use client";

import useSWR from "swr";
import Link from "next/link";
import { timeAgo } from "@/lib/money";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function FeedPreview({ loggedIn }: { loggedIn: boolean }) {
  const { data, isLoading } = useSWR("/api/posts", fetcher);
  const items = (data?.items ?? []).slice(0, 4);

  return (
    <div className="space-y-3">
      {isLoading && <p className="text-sm text-slate-400">Loading feed...</p>}
      {items.map((post: any) => (
        <Link
          key={post.id}
          href="/feed"
          className="block rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-green-600 text-xs font-bold text-white">
              {post.author.avatarUrl ? (
                <img src={post.author.avatarUrl} className="h-full w-full object-cover" alt="" />
              ) : (
                post.author.username.slice(0, 2).toUpperCase()
              )}
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{post.author.username}</p>
              <p className="text-[11px] text-slate-400">{timeAgo(post.createdAt)}</p>
            </div>
          </div>
          {post.content && <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{post.content}</p>}
          {post.media?.[0] && (
            <img src={post.media[0].url} className="mt-2 h-32 w-full rounded-xl object-cover" alt="" />
          )}
          <p className="mt-2 flex gap-3 text-xs text-slate-400">
            <span>❤️ {post.likeCount}</span>
            <span>💬 {post.commentCount}</span>
          </p>
        </Link>
      ))}
      {!isLoading && items.length === 0 && (
        <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400 dark:border-slate-700">
          No posts yet. Be the first to share something!
        </p>
      )}
      <Link href="/feed" className="block rounded-2xl border border-green-600 py-2 text-center text-sm font-semibold text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30">
        {loggedIn ? "Open Social Feed" : "View Social Feed"}
      </Link>
    </div>
  );
}
