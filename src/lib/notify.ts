/**
 * Local notifications — no backend.
 *
 * What this supports: asking permission, showing a notification while the app
 * is open or on-open (via the service-worker registration so taps are handled
 * by notification-sw.js), and a manual test.
 *
 * What it deliberately does NOT do: deliver a push when the app is fully closed
 * (e.g. "you'll dip on Tuesday" arriving on its own). That needs a server to
 * compute and send on a schedule plus storage for push subscriptions — out of
 * scope for a private, on-device app.
 */

export type NotifyState = "granted" | "default" | "denied" | "unsupported";

export function notifySupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function notifyState(): NotifyState {
  if (!notifySupported()) return "unsupported";
  return Notification.permission as NotifyState;
}

export async function requestNotify(): Promise<NotifyState> {
  if (!notifySupported()) return "unsupported";
  try {
    return (await Notification.requestPermission()) as NotifyState;
  } catch {
    return "denied";
  }
}

async function show(title: string, options: NotificationOptions): Promise<boolean> {
  if (notifyState() !== "granted") return false;
  const opts: NotificationOptions = {
    icon: "/pwa-192.png",
    badge: "/pwa-192.png",
    ...options,
  };
  try {
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) {
        await reg.showNotification(title, opts);
        return true;
      }
    }
    new Notification(title, opts);
    return true;
  } catch {
    return false;
  }
}

export function sendTestNotification(): Promise<boolean> {
  return show("Headroom", {
    body: "Notifications are on. We'll only ping you before you'd dip low.",
    tag: "headroom-test",
  });
}

export function sendHeadsUp(body: string, tag: string): Promise<boolean> {
  return show("Headroom", { body, tag });
}
