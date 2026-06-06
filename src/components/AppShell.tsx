import type { ReactNode } from "react";
import AmbientBackground from "./AmbientBackground";

interface AppShellProps {
  children: ReactNode;
  footer?: ReactNode;
}

export default function AppShell({ children, footer }: AppShellProps) {
  return (
    <>
      <AmbientBackground />
      <div className="app-shell">
        <main className="flex-1 flex flex-col min-h-0">{children}</main>
        {footer}
      </div>
    </>
  );
}
