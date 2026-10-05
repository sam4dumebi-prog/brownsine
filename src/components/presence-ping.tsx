"use client";

import { useEffect } from "react";

export function PresencePing() {
  useEffect(() => {
    const ping = () => {
      fetch("/api/presence", { method: "POST" }).catch(() => {});
    };
    ping();
    const interval = setInterval(ping, 30_000);
    return () => clearInterval(interval);
  }, []);

  return null;
}
