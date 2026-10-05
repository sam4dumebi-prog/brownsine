import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getCurrentUser } from "@/lib/auth";
import { PresencePing } from "@/components/presence-ping";

export const metadata: Metadata = {
  title: "Okonjo Market — Buy & Sell Anything in Nigeria",
  description:
    "Okonjo Market is Nigeria's social-commerce marketplace. Discover, advertise, buy and sell phones, fashion, cars, houses and more.",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  const safeUser = user
    ? {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        role: user.role,
      }
    : null;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased flex min-h-screen flex-col bg-[#f7f8fa] text-slate-900 dark:bg-[#0b1120] dark:text-slate-100">
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('okonjo-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`,
          }}
        />
        <ThemeProvider>
          <Navbar user={safeUser} />
          {user && <PresencePing />}
          <div className="flex-1">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
