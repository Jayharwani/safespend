import { useCallback, useEffect, useMemo, useState } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import { AnimatePresence } from "framer-motion";
import type { AppData, Bill, OverlayScreen, PayFrequency, TabId } from "./types";
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
import MenuScreen from "./components/MenuScreen";
import InsightsScreen from "./components/InsightsScreen";
import PaydayScreen from "./components/PaydayScreen";
import EntrySheet, { type SheetEntry } from "./components/EntrySheet";
import EditSheet, { type EditTarget } from "./components/EditSheet";
import Toast from "./components/Toast";

export default function App() {
  const [data, setData] = useState<AppData>(loadData);
  const [showSplash, setShowSplash] = useState(true);
  const [tab, setTab] = useState<TabId>("today");
  const [overlay, setOverlay] = useState<OverlayScreen>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showPayday, setShowPayday] = useState(false);

  const projection = useMemo(() => projectBudget(data), [data]);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 2600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!data.setupComplete || showSplash) return;
    const today = format(new Date(), "yyyy-MM-dd");
    const isPayday =
      projection.daysUntilPayday === 0 || isSameDay(parseISO(data.nextPayday), new Date());
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

  const handleSetupComplete = (patch: Partial<AppData>) => {
    updateData({ ...patch, setupComplete: true, allSetSeen: false });
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
      setToast("Logged");
    } else if (entry.type === "bill") {
      updateData({
        oneOffs: [
          ...data.oneOffs,
          { id: generateId(), name: entry.name, amount: entry.amount, date: entry.date, type: "bill" },
        ],
      });
      setToast("Bill added");
    } else {
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

  const handleSaveBill = (bill: Bill) => {
    const exists = data.bills.some((b) => b.id === bill.id);
    if (exists) {
      updateData({ bills: data.bills.map((b) => (b.id === bill.id ? bill : b)) });
      setToast("Bill updated");
    } else {
      updateData({ bills: [...data.bills, { ...bill, id: generateId() }] });
      setToast("Bill added");
    }
  };

  const handleDeleteBill = (id: string) => {
    updateData({ bills: data.bills.filter((b) => b.id !== id) });
    setToast("Bill removed");
  };

  const handleSavePaycheck = (p: {
    payAmount: number;
    payFrequency: PayFrequency;
    nextPayday: string;
  }) => {
    updateData(p);
    setToast("Paycheck updated");
  };

  const handleReset = () => {
    if (!window.confirm("Delete all your data and start over?")) return;
    localStorage.removeItem("safespend-data");
    setData(loadData());
    setTab("today");
    setOverlay(null);
    setShowSplash(true);
    setTimeout(() => setShowSplash(false), 2600);
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

  if (showSplash) return <SplashScreen />;

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

  if (overlay === "insights") {
    return (
      <PageTransition id="insights">
        <InsightsScreen data={data} onBack={() => setOverlay(null)} />
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
              onAdd={() => setSheetOpen(true)}
              onEditBalance={() => setEditTarget({ kind: "balance", balance: data.balance })}
            />
          )}
          {tab === "plan" && <PlanScreen data={data} onEdit={setEditTarget} />}
          {tab === "menu" && (
            <MenuScreen
              onOpenInsights={() => setOverlay("insights")}
              onReset={handleReset}
              onLoadDemo={handleLoadDemo}
              onPreviewPayday={() => setShowPayday(true)}
            />
          )}
        </PageTransition>
      </AppShell>

      <EntrySheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSubmit={handleEntrySubmit}
        initial={{ type: "spend" }}
      />

      <EditSheet
        target={editTarget}
        onClose={() => setEditTarget(null)}
        onSaveBalance={(balance) => updateData({ balance })}
        onSavePaycheck={handleSavePaycheck}
        onSaveBill={handleSaveBill}
        onDeleteBill={handleDeleteBill}
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
