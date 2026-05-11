import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, FileCheck2, Files, UploadCloud } from "lucide-react";

import "./globals.css";

export const metadata: Metadata = {
  title: "NeuralParse",
  description: "Enterprise document intelligence platform",
};

const navItems = [
  { href: "/", label: "Upload", icon: UploadCloud },
  { href: "/documents", label: "Documents", icon: Files },
  { href: "/review", label: "Review", icon: FileCheck2 },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-white px-4 py-5 md:block">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">NeuralParse</p>
              <h1 className="mt-1 text-xl font-semibold text-ink">Document Intelligence</h1>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-panel hover:text-ink"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
          <main className="md:pl-64">
            <div className="mx-auto max-w-6xl px-4 py-6 md:px-8">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}

