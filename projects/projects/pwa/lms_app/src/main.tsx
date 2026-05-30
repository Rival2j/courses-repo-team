import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import App from "./App";
import "./styles.css";
import { registerServiceWorker, setupInstallPrompt } from './lib/pwa';
import { getQueuedActions } from './lib/offlineQueue';

// register service worker and setup install prompt
registerServiceWorker().catch(() => {});
setupInstallPrompt();

// try to process queued actions when back online (app handles actual sync)
window.addEventListener('online', async () => {
  const queued = await getQueuedActions();
  if (queued && queued.length) {
    // main app should process queued actions (placeholder)
    console.info('Queued actions available for sync', queued.length);
  }
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
