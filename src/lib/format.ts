export const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;

export const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

export const addDays = (iso: string, days: number) => {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + days);
  return toISO(d);
};

export const todayISO = () => {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  return toISO(d);
};

const humanFmt = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

export const humanDate = (iso: string) =>
  humanFmt.format(new Date(iso + "T12:00:00"));

export const diffDays = (a: string, b: string) => {
  const ms =
    new Date(b + "T12:00:00").getTime() - new Date(a + "T12:00:00").getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
};
