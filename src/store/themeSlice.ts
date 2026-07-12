import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeState {
  mode: ThemeMode;
}

export const applyTheme = (mode: ThemeMode) => {
  if (typeof window === "undefined") return;
  const root = window.document.documentElement;
  root.classList.remove("light", "dark");

  let activeTheme = mode;
  if (mode === "system") {
    activeTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  root.classList.add(activeTheme);
};

const getSavedTheme = (): ThemeMode => {
  if (typeof window === "undefined") return "system";
  const saved = localStorage.getItem("theme_mode") as ThemeMode;
  if (saved === "light" || saved === "dark" || saved === "system") {
    return saved;
  }
  return "system";
};

const initialMode = getSavedTheme();
applyTheme(initialMode);

const initialState: ThemeState = {
  mode: initialMode,
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      let nextMode: ThemeMode = "light";
      if (state.mode === "light") {
        nextMode = "dark";
      } else if (state.mode === "dark") {
        nextMode = "system";
      } else {
        nextMode = "light";
      }
      state.mode = nextMode;
      localStorage.setItem("theme_mode", nextMode);
      applyTheme(nextMode);
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      localStorage.setItem("theme_mode", action.payload);
      applyTheme(action.payload);
    },
  },
});

export const selectThemeMode = (state: { theme: ThemeState }) => state.theme.mode;

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
