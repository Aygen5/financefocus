import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store, useAppSelector } from "@/store";
import { router } from "@/routes";
import { Toaster } from "react-hot-toast";
import "./App.css";

const ThemeInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const themeMode = useAppSelector((state) => state.theme.mode);

  useEffect(() => {
    if (themeMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [themeMode]);

  return <>{children}</>;
};

function App() {
  return (
    <Provider store={store}>
      <ThemeInitializer>
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
      </ThemeInitializer>
    </Provider>
  );
}

export default App;
