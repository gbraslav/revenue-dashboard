"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

interface Settings {
  font: string;
  backgroundColor: string;
}

interface SettingsContextValue {
  settings: Settings;
  refetch: () => Promise<void>;
}

const DEFAULTS: Settings = {
  font: "playfair",
  backgroundColor: "#0b1120",
};

const FONT_FAMILY_MAP: Record<string, string> = {
  playfair: "var(--font-playfair), serif",
  inter: "var(--font-inter), sans-serif",
  roboto: "var(--font-roboto), sans-serif",
  opensans: "var(--font-opensans), sans-serif",
  lato: "var(--font-lato), sans-serif",
  merriweather: "var(--font-merriweather), serif",
  montserrat: "var(--font-montserrat), sans-serif",
  nunito: "var(--font-nunito), sans-serif",
  raleway: "var(--font-raleway), sans-serif",
  sourcesans: "var(--font-sourcesans), sans-serif",
  poppins: "var(--font-poppins), sans-serif",
  dmsans: "var(--font-dmsans), sans-serif",
};

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULTS,
  refetch: async () => {},
});

export function useSettings() {
  return useContext(SettingsContext);
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);

  const refetch = useCallback(async () => {
    const res = await fetch("/api/settings");
    if (res.ok) {
      const data = await res.json();
      setSettings(data);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <SettingsContext.Provider value={{ settings, refetch }}>
      <div
        style={{
          fontFamily: FONT_FAMILY_MAP[settings.font] ?? FONT_FAMILY_MAP.playfair,
          backgroundColor: settings.backgroundColor,
        }}
        className="min-h-full flex flex-col flex-1"
      >
        {children}
      </div>
    </SettingsContext.Provider>
  );
}
