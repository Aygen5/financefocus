import { describe, it, expect, beforeEach } from "vitest";
import themeReducer, { setTheme, toggleTheme } from "../store/themeSlice";
import type { ThemeState } from "../store/themeSlice";

describe("themeSlice Redux Tests", () => {
  const initialState: ThemeState = {
    mode: "dark",
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it("should return the initial state", () => {
    expect(themeReducer(undefined, { type: "unknown" })).toEqual({
      mode: "dark",
    });
  });

  it("should handle setTheme and save to localStorage", () => {
    const nextState = themeReducer(initialState, setTheme("dark"));
    expect(nextState.mode).toBe("dark");
    expect(localStorage.getItem("theme_mode")).toBe("dark");
  });

  it("should handle toggleTheme and save to localStorage", () => {
    const stateWithLight: ThemeState = { mode: "light" };
    const nextState = themeReducer(stateWithLight, toggleTheme());
    expect(nextState.mode).toBe("dark");
    expect(localStorage.getItem("theme_mode")).toBe("dark");
  });
});
