export type ThemePreference = "light" | "dark" | "system";
export const THEME_STORAGE_KEY = "formwork-theme";

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

// Static, trusted source. Run in the head before the first body paint; no storage
// writes on arrival. CSS handles System and the JavaScript-free fallback.
export const themeBootstrap = `(function(){var t="system";try{var s=localStorage.getItem("${THEME_STORAGE_KEY}");if(s==="light"||s==="dark"||s==="system")t=s;}catch(e){}document.documentElement.dataset.theme=t;})();`;
