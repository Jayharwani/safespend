import { useCallback, useEffect, useMemo, useState } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import { AnimatePresence } from "framer-motion";
import type { AppData, Bill, OverlayScreen, PayFrequency, TabId } from "./types";
import { defaultData, generateId } from "./lib/storage";
import { initData, persist, clearData, exportData, parseImport } from "./lib/db";
import { projectBudget } from "./lib/finance";
import { getDemoData } from "./lib/demos";
import { getHeadsUp } from "./lib/headsup";
import {
  notifyState,
  requestNotify,
  sendTestNotification,
  sendHeadsUp,
  type NotifyState,
} from "./lib/notify";
import HeadsUpBanner from "./components/HeadsUpBanner";
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
  const [data, setData] = useState<AppData>(defaultData);
  const [hydrated, setHydrated] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [tab, setTab] = useState<TabId>("today");
  const [overlay, setOverlay] = useState<OverlayScreen>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showPayday, setShowPayday] = useState(false);
  const [notifPerm, setNotifPerm] = useState<NotifyState>(() => notifyState());
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const projection = useMemo(() => projectBudget(data), [data]);
  const paydayLabel = format(new Date(data.nextPayday), "MMM d");
  const headsUp = useMemo(
    () => getHeadsUp(projection, paydayLabel),
    [projection, paydayLabel]
  );

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 2600);
    return () => clearTimeout(t);
  }, []);

  // Hydrate from IndexedDB (migrating any legacy localStorage on first run).
  useEffect(() => {
    let alive = true;
    initData().then((loaded) => {
      if (alive) {
        setData(loaded);
        setHydrated(true);
      }
    });
    return () => {
      alive = false;
    };
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

  // On-open local notification: fire at most once per day when there's a
  // notify-worthy heads-up (a projected dip, or payday) and permission is on.
  useEffect(() => {
    if (!hydrated || !data.setupComplete || showSplash) return;
    if (notifPerm !== "granted" || !headsUp?.notify) return;
    const today = format(new Date(), "yyyy-MM-dd");
    if (data.lastNotified === today) return;
    sendHeadsUp(headsUp.message, headsUp.tag);
    updateData({ lastNotified: today });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, data.setupComplete, showSplash, notifPerm, headsUp]);

  const updateData = useCallback((patch: Partial<AppData>) => {
    setData((prev) => {
      const next = { ...prev, ...patch };
      persist(next);
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
    if (!window.confirm("Delete all your data and start over? This can't be undone.")) return;
    clearData().then(() => {
      setData({ ...defaultData });
      setTab("today");
      setOverlay(null);
      setShowSplash(true);
      setTimeout(() => setShowSplash(false), 2600);
    });
  };

  const handleLoadDemo = (scenario: "healthy" | "tight" | "danger") => {
    const demo = getDemoData(scenario);
    setData(demo);
    persist(demo);
    setTab("today");
  };

  const handleExport = () => {
    exportData(data);
    setToast("Backup downloaded");
  };

  const handleImport = (text: string) => {
    try {
      const imported = parseImport(text);
      setData(imported);
      persist(imported);
      setTab("today");
      setOverlay(null);
      setToast("Backup restored");
    } catch {
      setToast("Couldn't read that backup file");
    }
  };

  const dismissPayday = () => {
    updateData({ lastPaydayCelebrated: format(new Date(), "yyyy-MM-dd") });
    setShowPayday(false);
  };

  const handleEnableNotifications = async () => {
    const state = await requestNotify();
    setNotifPerm(state);
    if (state === "granted") setToast("Alerts are on");
    else if (state === "denied") setToast("Alerts are blocked — enable them in your browser settings");
  };

  const handleTestNotification = async () => {
    if (notifyState() !== "granted") {
      const state = await requestNotify();
      setNotifPerm(state);
      if (state !== "granted") {
        setToast("Allow notifications first");
        return;
      }
    }
    const ok = await sendTestNotification();
    setToast(ok ? "Test notification sent" : "Couldn't send a notification");
  };

  // Onboarding "Turn on alerts": the friendly pre-ask before the system prompt.
  const handleOnboardingAllow = async () => {
    const state = await requestNotify();
    setNotifPerm(state);
    updateData({ permissionsSeen: true });
  };

  if (showSplash || !hydrated) return <SplashScreen />;

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
          onAllow={handleOnboardingAllow}
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
              banner={
                headsUp && !bannerDismissed ? (
                  <HeadsUpBanner
                    headsUp={headsUp}
                    onAdjust={() => setTab("plan")}
                    onDismiss={() => setBannerDismissed(true)}
                  />
                ) : null
              }
            />
          )}
          {tab === "plan" && <PlanScreen data={data} onEdit={setEditTarget} />}
          {tab === "menu" && (
            <MenuScreen
              onOpenInsights={() => setOverlay("insights")}
              onReset={handleReset}
              onExport={handleExport}
              onImport={handleImport}
              notifPerm={notifPerm}
              onEnableNotifications={handleEnableNotifications}
              onTestNotification={handleTestNotification}
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
