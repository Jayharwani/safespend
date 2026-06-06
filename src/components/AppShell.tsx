import type { ReactNode } from "react";
import AmbientBackground from "./AmbientBackground";
import type { BudgetStatus } from "../types";

interface AppShellProps {
  children: ReactNode;
  footer?: ReactNode;
  status?: BudgetStatus;
}

export default function AppShell({ children, footer, status = "healthy" }: AppShellProps) {
  return (
    <>
      <AmbientBackground status={status} />
      <div className="app-shell">
        <main className="flex-1 flex flex-col min-h-0">{children}</main>
        {footer}
      </div>
    </>
  );
}
