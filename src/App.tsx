import { useCallback, useEffect, useMemo, useState } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import { AnimatePresence } from "framer-motion";
import type { AppData, OverlayScreen, TabId } from "./types";
import { loadData, saveData, generateId } from "./lib/storage";
import { projectBudget } from "./lib/finance";
import { getDemoData } from "./lib/demos";
import AppShell from "./components/AppShell";
import TabBar from "./components/TabBar";
import PageTransition from "./components/PageTransition";
import SplashScreen from "./components/SplashScreen";
import OnboardingScreen from "./components/OnboardingScreen";
import SignUpScreen from "./components/SignUpScreen";
import PermissionsScreen from "./components/PermissionsScreen";
import SetupFlow from "./components/SetupFlow";
import AllSetScreen from "./components/AllSetScreen";
import TodayScreen from "./components/TodayScreen";
import PlanScreen from "./components/PlanScreen";
import SettingsScreen from "./components/SettingsScreen";
import SpendLogScreen from "./components/SpendLogScreen";
import PaydayScreen from "./components/PaydayScreen";
import EntrySheet, { type SheetEntry } from "./components/EntrySheet";
import Toast from "./components/Toast";

type SheetIntent = "spend" | "bill" | "income" | "recurring-bill";

export default function App() {
  const [data, setData] = useState<AppData>(loadData);
  const [showSplash, setShowSplash] = useState(true);
  const [tab, setTab] = useState<TabId>("today");
  const [overlay, setOverlay] = useState<OverlayScreen>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetIntent, setSheetIntent] = useState<SheetIntent>("spend");
  const [toast, setToast] = useState<string | null>(null);
  const [showPayday, setShowPayday] = useState(false);

  const projection = useMemo(() => projectBudget(data), [data]);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!data.setupComplete || showSplash) return;
    const today = format(new Date(), "yyyy-MM-dd");
    const isPayday =
      projection.daysUntilPayday === 0 ||
      isSameDay(parseISO(data.nextPayday), new Date());
    if (isPayday && data.lastPaydayCelebrated !== today) {
      setShowPayday(true);
    }
  }, [data.setupComplete, data.nextPayday, data.lastPaydayCelebrated, projection.daysUntilPayday, showSplash]);

  const updateData = useCallback((patch: Partial<AppData>) => {
    setData((prev) => {
      const next = { ...prev, ...patch };
      saveData(next);
      return next;
    });
  }, []);

  const openSheet = (intent: SheetIntent) => {
    setSheetIntent(intent);
    setSheetOpen(true);
  };

  const handleSetupComplete = (patch: Partial<AppData>) => {
    updateData({ ...patch, setupComplete: true, allSetSeen: false });
  };

  const handleEntrySubmit = (entry: SheetEntry) => {
    if (sheetIntent === "recurring-bill") {
      const dayOfMonth = new Date(entry.date).getDate();
      updateData({
        bills: [
          ...data.bills,
          { id: generateId(), name: entry.name, amount: entry.amount, dayOfMonth },
        ],
      });
      setToast("Bill added");
      return;
    }

    if (entry.type === "spend") {
      updateData({
        balance: data.balance - entry.amount,
        oneOffs: [
          ...data.oneOffs,
          { id: generateId(), name: entry.name, amount: entry.amount, date: entry.date, type: "spend" },
        ],
      });
      setToast("Logged");
    } else if (entry.type === "bill") {
      updateData({
        oneOffs: [
          ...data.oneOffs,
          { id: generateId(), name: entry.name, amount: entry.amount, date: entry.date, type: "bill" },
        ],
      });
      setToast("Bill added");
    } else if (entry.type === "income") {
      updateData({
        balance: data.balance + entry.amount,
        oneOffs: [
          ...data.oneOffs,
          { id: generateId(), name: entry.name, amount: entry.amount, date: entry.date, type: "income" },
        ],
      });
      setToast("Income added");
    }
  };

  const handleReset = () => {
    localStorage.removeItem("safespend-data");
    setData(loadData());
    setTab("today");
    setOverlay(null);
    setShowSplash(true);
    setTimeout(() => setShowSplash(false), 800);
  };

  const handleLoadDemo = (scenario: "healthy" | "tight" | "danger") => {
    const demo = getDemoData(scenario);
    setData(demo);
    saveData(demo);
    setTab("today");
  };

  const dismissPayday = () => {
    updateData({ lastPaydayCelebrated: format(new Date(), "yyyy-MM-dd") });
    setShowPayday(false);
  };

  const sheetInitial = {
    type:
      sheetIntent === "income"
        ? ("income" as const)
        : sheetIntent === "spend"
          ? ("spend" as const)
          : ("bill" as const),
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  if (!data.onboardingComplete) {
    return (
      <PageTransition id="onboarding">
        <OnboardingScreen
          onComplete={() => updateData({ onboardingComplete: true, welcomeSeen: true })}
          onSkip={() => updateData({ onboardingComplete: true, welcomeSeen: true })}
        />
      </PageTransition>
    );
  }

  if (!data.signedUp) {
    return (
      <PageTransition id="signup">
        <SignUpScreen onGuest={() => updateData({ signedUp: true })} />
      </PageTransition>
    );
  }

  if (!data.permissionsSeen) {
    return (
      <PageTransition id="permissions">
        <PermissionsScreen
          onAllow={() => updateData({ permissionsSeen: true })}
          onSkip={() => updateData({ permissionsSeen: true })}
        />
      </PageTransition>
    );
  }

  if (!data.setupComplete) {
    return (
      <PageTransition id="setup">
        <SetupFlow onComplete={handleSetupComplete} />
      </PageTransition>
    );
  }

  if (!data.allSetSeen) {
    return (
      <PageTransition id="allset">
        <AllSetScreen
          safeToSpend={projection.safeToSpend}
          onContinue={() => updateData({ allSetSeen: true })}
        />
      </PageTransition>
    );
  }

  if (overlay === "spend-log") {
    return (
      <PageTransition id="spend-log">
        <SpendLogScreen data={data} onBack={() => setOverlay(null)} />
      </PageTransition>
    );
  }

  return (
    <>
      <AppShell footer={<TabBar active={tab} onChange={setTab} />}>
        <PageTransition id={tab}>
          {tab === "today" && (
            <TodayScreen
              data={data}
              projection={projection}
              onLogSpend={() => openSheet("spend")}
              onOpenSpendLog={() => setOverlay("spend-log")}
              onOpenSettings={() => setTab("settings")}
            />
          )}
          {tab === "plan" && (
            <PlanScreen
              data={data}
              projection={projection}
              onAddBill={() => openSheet("recurring-bill")}
              onAddIncome={() => openSheet("income")}
            />
          )}
          {tab === "settings" && (
            <SettingsScreen
              data={data}
              onUpdateBalance={(balance) => updateData({ balance })}
              onLoadDemo={handleLoadDemo}
              onReset={handleReset}
              onPreviewPayday={() => setShowPayday(true)}
            />
          )}
        </PageTransition>
      </AppShell>

      <EntrySheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSubmit={handleEntrySubmit}
        initial={sheetInitial}
      />

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      <AnimatePresence>
        {showPayday && (
          <PaydayScreen safeToSpend={projection.safeToSpend} onDismiss={dismissPayday} />
        )}
      </AnimatePresence>
    </>
  );
}
