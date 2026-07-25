import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store, useAppSelector } from "@/store";
import { router } from "@/routes";
import { Toaster } from "react-hot-toast";
import { applyTheme } from "@/store/themeSlice";
import { useIdleTimeout } from "@/hooks/useIdleTimeout";
import "./App.css";

const AppInitializers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const themeMode = useAppSelector((state) => state.theme.mode);

  useIdleTimeout();

  useEffect(() => {
    applyTheme(themeMode);

    if (themeMode === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        applyTheme("system");
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    }
  }, [themeMode]);

  return <>{children}</>;
};

function App() {
  return (
    <Provider store={store}>
      <AppInitializers>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            className: "dark:bg-slate-800 dark:text-white bg-white text-slate-800",
            style: {
              borderRadius: "12px",
              fontSize: "14px",
            },
          }}
        />
      </AppInitializers>
    </Provider>
  );
}

export default App;
