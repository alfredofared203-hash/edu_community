import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "./AuthContext";

const AppSettingsContext = createContext(null);
const defaultSettings = { theme: "light", language: "ar" };

export function AppSettingsProvider({ children }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState(() => {
    try {
      return { ...defaultSettings, ...JSON.parse(localStorage.getItem("appSettings") || "{}") };
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    const next = { ...defaultSettings, ...(user?.preferences || {}) };
    setSettings((current) => user?.preferences ? next : current);
  }, [user]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", settings.theme === "dark");
    document.documentElement.lang = settings.language;
    document.documentElement.dir = settings.language === "ar" ? "rtl" : "ltr";
    localStorage.setItem("appSettings", JSON.stringify(settings));
  }, [settings]);

  const updateSettings = async (changes) => {
    const next = { ...settings, ...changes };
    setSettings(next);
    if (user) {
      const formData = new FormData();
      formData.append("theme", next.theme);
      formData.append("language", next.language);
      await api.updateProfile(formData);
    }
  };

  return <AppSettingsContext.Provider value={{ settings, updateSettings }}>
    {children}
  </AppSettingsContext.Provider>;
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);
  if (!context) throw new Error("useAppSettings must be used within AppSettingsProvider");
  return context;
}
