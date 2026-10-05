import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { SellForm } from "@/components/sell-form";

export default async function SellPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/sell");

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sell Something</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        List your product for buyers across Nigeria to discover. Fill in accurate details for faster sales.
      </p>
      <SellForm />
    </main>
  );
}
