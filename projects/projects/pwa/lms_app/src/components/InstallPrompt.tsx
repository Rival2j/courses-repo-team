import React, { useEffect, useState } from 'react';
import { setupInstallPrompt, promptInstall } from '../lib/pwa';

export default function InstallPrompt() {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    setupInstallPrompt((ok) => setAvailable(ok));
  }, []);

  if (!available) return null;

  return (
    <div style={{position:'fixed',right:16,bottom:16,zIndex:1000}}>
      <button onClick={() => promptInstall().then(()=>setAvailable(false))}>
        Instalar App
      </button>
    </div>
  );
}
