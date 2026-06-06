import { useCallback, useMemo, useState } from "react";
import type { AppData } from "./types";
import { loadData, saveData, generateId } from "./lib/storage";
import { projectBudget } from "./lib/finance";
import { getDemoData } from "./lib/demos";
import SetupFlow from "./components/SetupFlow";
import TodayScreen from "./components/TodayScreen";
import EntrySheet, { type SheetEntry } from "./components/EntrySheet";
import SettingsSheet from "./components/SettingsSheet";

export default function App() {
  const [data, setData] = useState<AppData>(loadData);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const projection = useMemo(() => projectBudget(data), [data]);

  const updateData = useCallback((patch: Partial<AppData>) => {
    setData((prev) => {
      const next = { ...prev, ...patch };
      saveData(next);
      return next;
    });
  }, []);

  const handleSetupComplete = (patch: Partial<AppData>) => {
    updateData(patch);
  };

  const handleEntrySubmit = (entry: SheetEntry) => {
    if (entry.type === "spend") {
      updateData({
        balance: data.balance - entry.amount,
        oneOffs: [
          ...data.oneOffs,
          { id: generateId(), name: entry.name, amount: entry.amount, date: entry.date, type: "spend" },
        ],
      });
    } else if (entry.type === "bill") {
      updateData({
        oneOffs: [
          ...data.oneOffs,
          { id: generateId(), name: entry.name, amount: entry.amount, date: entry.date, type: "bill" },
        ],
      });
    } else if (entry.type === "income") {
      updateData({
        balance: data.balance + entry.amount,
        oneOffs: [
          ...data.oneOffs,
          { id: generateId(), name: entry.name, amount: entry.amount, date: entry.date, type: "income" },
        ],
      });
    }
  };

  const handleReset = () => {
    localStorage.removeItem("safespend-data");
    setData(loadData());
  };

  const handleLoadDemo = (scenario: "healthy" | "tight" | "danger") => {
    const demo = getDemoData(scenario);
    setData(demo);
    saveData(demo);
  };

  if (!data.setupComplete) {
    return <SetupFlow onComplete={handleSetupComplete} />;
  }

  return (
    <>
      <TodayScreen
        data={data}
        projection={projection}
        onLogSpend={() => setSheetOpen(true)}
        onSettings={() => setSettingsOpen(true)}
      />

      <EntrySheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSubmit={handleEntrySubmit}
        initial={{ type: "spend" }}
      />

      <SettingsSheet
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onReset={handleReset}
        onLoadDemo={handleLoadDemo}
      />
    </>
  );
}
