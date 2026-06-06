import { CalendarDays, Home, Settings } from "lucide-react";
import { motion } from "framer-motion";
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
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[398px] rounded-full tabbar-glass shadow-e3 p-1.5 flex justify-between items-center z-40"
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
            className="relative flex-1 flex flex-col items-center justify-center gap-[2px] h-[52px] min-w-[44px] bg-transparent border-none cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
            style={{ color: isActive ? "var(--brand)" : "var(--ink-soft)" }}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute inset-0 bg-brand-tint dark:bg-brand-soft rounded-full -z-10"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <Icon
              className="w-5 h-5 relative z-10 transition-transform duration-200"
              strokeWidth={isActive ? 2.25 : 1.75}
              style={{ transform: isActive ? "translateY(-1px)" : "translateY(0)" }}
            />
            <span className="text-[11px] font-semibold tracking-[-0.1px] relative z-10">
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
