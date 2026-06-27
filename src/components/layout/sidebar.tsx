"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Briefcase,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  UserPlus,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/jobs",
    label: "Job Openings",
    icon: Briefcase,
  },
  {
    href: "/interviews",
    label: "Interviews",
    icon: CalendarDays,
  },
  {
    href: "/candidates/new",
    label: "Add Candidate",
    icon: UserPlus,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isLoading = status === "loading";


  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="border-b border-sidebar-border px-6 py-5">
        <Link
          href="/dashboard"
          className="flex items-center gap-3"
        >
          <Image
            src="/images/rove-hire-logo.png"
            alt="ROVE Hire"
            width={36}
            height={36}
            priority
            className="rounded-md"
          />

          <div>
            <p className="text-sm font-semibold">
              ROVE Hire
            </p>

            <p className="text-xs text-sidebar-muted">
              Recruitment Platform
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map(
          ({ href, label, icon: Icon }) => {
            const active =
              pathname === href ||
              pathname.startsWith(`${href}/`);

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-accent text-white"
                    : "text-sidebar-muted hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />

                <span>{label}</span>
              </Link>
            );
          }
        )}
      </nav>

      {/* User */}
      {isLoading ? (
        <div className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
          <div className="h-3 w-32 animate-pulse rounded bg-white/10" />
        </div>
      ) : (
        <div className="border-t border-sidebar-border p-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent font-semibold text-white">
              {session?.user?.name
                ?.split(" ")
                .map((name) => name[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() ?? "HR"}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {session?.user?.name ?? "HR Admin"}
              </p>

              <p className="truncate text-xs text-sidebar-muted">
                {session?.user?.email}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-sidebar-muted hover:bg-white/5 hover:text-white"
            onClick={() =>
              signOut({
                callbackUrl: "/login",
              })
            }
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      )}
    </aside>
  );
}