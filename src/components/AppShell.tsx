import type { ReactNode } from "react";
import AuroraBackground from "./AuroraBackground";
import InstallHint from "./InstallHint";
import OfflineNotice from "./OfflineNotice";

interface AppShellProps {
  children: ReactNode;
  footer?: ReactNode;
}

export default function AppShell({ children, footer }: AppShellProps) {
  return (
    <>
      <AuroraBackground />
      <OfflineNotice />
      <div className="app-shell">
        <InstallHint />
        <main className="flex-1 flex flex-col min-h-0">{children}</main>
        {footer}
      </div>
    </>
  );
}
