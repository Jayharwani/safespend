import { CalendarDays, Home, Settings } from "lucide-react";
import type { TabId } from "../types";

interface TabBarProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: "today", label: "Today", icon: Home },
  { id: "plan", label: "Plan", icon: CalendarDays },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function TabBar({ active, onChange }: TabBarProps) {
  return (
    <nav
      className="sticky bottom-0 z-40 flex border-t border-border-subtle tabbar-glass"
      style={{
        height: "calc(58px + env(safe-area-inset-bottom))",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
      role="tablist"
      aria-label="Main navigation"
    >
      {TABS.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(id)}
            className="flex-1 flex flex-col items-center justify-center gap-[3px] min-h-[58px] min-w-[44px] bg-transparent border-none"
            style={{ color: isActive ? "var(--brand)" : "var(--ink-faint)" }}
          >
            <Icon
              className={`w-6 h-6 ${isActive ? "tab-icon-active" : ""}`}
              strokeWidth={isActive ? 2 : 1.75}
            />
            <span className={`text-[12px] leading-[1.3] ${isActive ? "font-medium" : ""}`}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
