"use client";

import {
  isThemePreference,
  THEME_STORAGE_KEY,
  type ThemePreference,
} from "./theme-preference";

const changeEvent = "formwork:theme-change";
let transitionFrame = 0;

function changeColors() {
  const root = document.documentElement;
  root.dataset.themeChanging = "";
  cancelAnimationFrame(transitionFrame);
  transitionFrame = requestAnimationFrame(() => {
    transitionFrame = requestAnimationFrame(() => {
      delete root.dataset.themeChanging;
      transitionFrame = 0;
    });
  });
}

function applyTheme(preference: ThemePreference) {
  changeColors();
  document.documentElement.dataset.theme = preference;
}

export function getTheme(): ThemePreference {
  const value = document.documentElement.dataset.theme;
  return isThemePreference(value) ? value : "system";
}

export function getServerTheme(): null {
  return null;
}

export function setTheme(preference: ThemePreference) {
  applyTheme(preference);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    /* Selection still works in memory. */
  }
  window.dispatchEvent(new Event(changeEvent));
}

export function subscribeTheme(callback: () => void) {
  if (!isThemePreference(document.documentElement.dataset.theme)) {
    let preference: ThemePreference = "system";
    try {
      const value = localStorage.getItem(THEME_STORAGE_KEY);
      if (isThemePreference(value)) preference = value;
    } catch {
      /* Device preference remains available through CSS. */
    }
    applyTheme(preference);
  }
  const media = matchMedia("(prefers-color-scheme: dark)");
  const deviceChanged = () => {
    if (getTheme() === "system") changeColors();
  };
  const stored = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY && event.key !== null) return;
    try {
      if (event.storageArea !== localStorage) return;
    } catch {
      return;
    }
    applyTheme(isThemePreference(event.newValue) ? event.newValue : "system");
    callback();
  };
  window.addEventListener(changeEvent, callback);
  window.addEventListener("storage", stored);
  media.addEventListener("change", deviceChanged);
  return () => {
    window.removeEventListener(changeEvent, callback);
    window.removeEventListener("storage", stored);
    media.removeEventListener("change", deviceChanged);
    cancelAnimationFrame(transitionFrame);
    delete document.documentElement.dataset.themeChanging;
  };
}
