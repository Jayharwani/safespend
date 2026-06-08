import { House, CalendarBlank, List } from "../lib/icons";
import { motion } from "framer-motion";
import type { TabId } from "../types";

interface TabBarProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string; icon: typeof House }[] = [
  { id: "today", label: "Home", icon: House },
  { id: "plan", label: "Plan", icon: CalendarBlank },
  { id: "menu", label: "Menu", icon: List },
];

export default function TabBar({ active, onChange }: TabBarProps) {
  return (
    <nav className="tabbar" role="tablist" aria-label="Main navigation">
      {TABS.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(id)}
            className={`tab ${isActive ? "active" : ""}`}
          >
            <motion.span
              style={{ display: "inline-flex" }}
              animate={isActive ? { y: -1 } : { y: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 26 }}
            >
              <Icon size={24} weight={isActive ? "fill" : "regular"} />
            </motion.span>
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
