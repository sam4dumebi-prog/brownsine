"use client";

import Link from "next/link";
import { useState } from "react";
import { formatNaira, timeAgo } from "@/lib/money";

export type PostData = {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; username: string; avatarUrl: string; verified: boolean };
  media: { url: string; type: string }[];
  likeCount: number;
  commentCount: number;
  shareCount: number;
  likedByMe: boolean;
  product: { id: string; title: string; price: string; image: string | null } | null;
};

export function PostCard({ post, loggedIn }: { post: PostData; loggedIn: boolean }) {
  const [liked, setLiked] = useState(post.likedByMe);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [commentCount, setCommentCount] = useState(post.commentCount);
  const [shareCount, setShareCount] = useState(post.shareCount);
  const [loadingComments, setLoadingComments] = useState(false);

  async function toggleLike() {
    if (!loggedIn) return (window.location.href = "/login");
    setLiked((v) => !v);
    setLikeCount((v) => (liked ? v - 1 : v + 1));
    await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
  }

  async function loadComments() {
    setShowComments((v) => !v);
    if (!showComments && comments.length === 0) {
      setLoadingComments(true);
      const res = await fetch(`/api/posts/${post.id}/comments`);
      const data = await res.json();
      setComments(data.items ?? []);
      setLoadingComments(false);
    }
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!loggedIn) return (window.location.href = "/login");
    if (!commentText.trim()) return;
    const res = await fetch(`/api/posts/${post.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: commentText }),
    });
    if (res.ok) {
      setComments((c) => [...c, { id: Date.now().toString(), content: commentText, author: { username: "You", avatarUrl: "" }, createdAt: new Date().toISOString() }]);
      setCommentCount((c) => c + 1);
      setCommentText("");
    }
  }

  async function share() {
    if (!loggedIn) return (window.location.href = "/login");
    setShareCount((v) => v + 1);
    await fetch(`/api/posts/${post.id}/share`, { method: "POST" });
    if (navigator.share) {
      navigator.share({ title: "Okonjo Market", url: window.location.origin + "/feed" }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.origin + "/feed");
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <Link href={`/profile/${post.author.username}`} className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-green-600 font-bold text-white">
          {post.author.avatarUrl ? <img src={post.author.avatarUrl} className="h-full w-full object-cover" alt="" /> : post.author.username.slice(0, 2).toUpperCase()}
        </Link>
        <div>
          <Link href={`/profile/${post.author.username}`} className="flex items-center gap-1 text-sm font-semibold text-slate-800 hover:underline dark:text-slate-100">
            {post.author.username} {post.author.verified && <span className="text-xs">✅</span>}
          </Link>
          <p className="text-xs text-slate-400">{timeAgo(post.createdAt)}</p>
        </div>
      </div>

      {post.content && <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200">{post.content}</p>}

      {post.media.length > 0 && (
        <div className={`mt-3 grid gap-1 overflow-hidden rounded-xl ${post.media.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
          {post.media.map((m, i) =>
            m.type === "video" ? (
              <video key={i} src={m.url} controls className="max-h-96 w-full bg-black object-cover" />
            ) : (
              <img key={i} src={m.url} className="max-h-96 w-full object-cover" alt="" />
            )
          )}
        </div>
      )}

      {post.product && (
        <Link href={`/product/${post.product.id}`} className="mt-3 flex items-center gap-3 rounded-xl border border-slate-200 p-2 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800">
          {post.product.image && <img src={post.product.image} className="h-14 w-14 rounded-lg object-cover" alt="" />}
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{post.product.title}</p>
            <p className="text-sm font-bold text-green-700 dark:text-green-400">{formatNaira(post.product.price)}</p>
          </div>
        </Link>
      )}

      <div className="mt-3 flex items-center gap-4 border-t border-slate-100 pt-3 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <button onClick={toggleLike} className={`flex items-center gap-1 hover:text-red-500 ${liked ? "text-red-500" : ""}`}>
          {liked ? "❤️" : "🤍"} {likeCount}
        </button>
        <button onClick={loadComments} className="flex items-center gap-1 hover:text-green-600">💬 {commentCount}</button>
        <button onClick={share} className="flex items-center gap-1 hover:text-green-600">🔁 {shareCount}</button>
      </div>

      {showComments && (
        <div className="mt-3 space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800">
          {loadingComments && <p className="text-xs text-slate-400">Loading comments...</p>}
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-2 text-sm">
              <span className="grid h-6 w-6 shrink-0 place-items-center overflow-hidden rounded-full bg-slate-300 text-[10px] font-bold text-white">
                {c.author.avatarUrl ? <img src={c.author.avatarUrl} className="h-full w-full object-cover" alt="" /> : c.author.username.slice(0, 2).toUpperCase()}
              </span>
              <div className="rounded-xl bg-slate-100 px-3 py-1.5 dark:bg-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-200">{c.author.username} </span>
                <span className="text-slate-600 dark:text-slate-300">{c.content}</span>
              </div>
            </div>
          ))}
          <form onSubmit={submitComment} className="flex gap-2 pt-1">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 rounded-full border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-green-500 dark:border-slate-700 dark:bg-slate-800"
            />
            <button className="rounded-full bg-green-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-green-700">Post</button>
          </form>
        </div>
      )}
    </div>
  );
}
