/* Imported into the Workbox-generated service worker (vite-plugin-pwa
   workbox.importScripts). Handles taps on Headroom notifications:
   focus an existing window if open, otherwise open the app. */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    (async () => {
      const all = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      for (const client of all) {
        if ("focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow("/");
      }
    })()
  );
});
