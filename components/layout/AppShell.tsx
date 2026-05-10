"use client";

import { ReactNode, useState } from "react";
import { Topbar } from "./Topbar";

export function AppShell({
  sidebar,
  children,
}: {
  sidebar?: ReactNode;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <Topbar onMobileToggle={() => setMobileOpen((v) => !v)} />
      <div
        className={
          sidebar
            ? "grid flex-1 grid-cols-1 md:grid-cols-[var(--sidebar-w)_minmax(0,1fr)]"
            : "flex flex-1"
        }
      >
        {sidebar && (
          <div className={mobileOpen ? "block md:block" : "hidden md:block"}>
            {sidebar}
          </div>
        )}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
