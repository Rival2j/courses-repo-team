/* Utilities to register service worker and handle install prompt */
export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  try {
    const reg = await navigator.serviceWorker.ready;
    // autoUpdate handled by VitePWA registerType
    return reg;
  } catch (e) {
    // ignore
  }
}

let deferredPrompt: any = null;
export function setupInstallPrompt(onChange?: (available: boolean) => void) {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    // @ts-ignore
    deferredPrompt = e;
    if (onChange) onChange(true);
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    if (onChange) onChange(false);
  });
}

export async function promptInstall() {
  if (!deferredPrompt) return false;
  try {
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    deferredPrompt = null;
    return choice.outcome === 'accepted';
  } catch {
    return false;
  }
}
