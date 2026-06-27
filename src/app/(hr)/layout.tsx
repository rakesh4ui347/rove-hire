import { ReactNode } from "react";

import { Sidebar } from "@/components/layout/sidebar";
import { requireAuth } from "@/lib/session";

interface HRLayoutProps {
  children: ReactNode;
}

export default async function HRLayout({
  children,
}: HRLayoutProps) {
  await requireAuth();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}