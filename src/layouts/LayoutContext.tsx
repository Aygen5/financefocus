/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";

interface LayoutContextType {
  isMobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleMobileOpen: () => void;
  toggleCollapsed: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar_collapsed");
    return saved === "true";
  });

  const toggleMobileOpen = () => setMobileOpen((prev) => !prev);
  const toggleCollapsed = () => setCollapsed((prev) => !prev);

  // Collapse durumunu yerel hafızada saklayalım
  useEffect(() => {
    localStorage.setItem("sidebar_collapsed", String(isCollapsed));
  }, [isCollapsed]);

  // Ekran boyutunu izleyen ve otomatik collapse/drawer yöneten efekt
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 1024) {
        // Mobil veya Tablet
        if (width >= 640 && width < 1024) {
          // Tablet -> Otomatik daralt
          setCollapsed(true);
        }
      } else {
        // Desktop -> Kayıtlı durumu geri yükle
        const saved = localStorage.getItem("sidebar_collapsed") === "true";
        setCollapsed(saved);
        setMobileOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <LayoutContext.Provider
      value={{
        isMobileOpen,
        setMobileOpen,
        isCollapsed,
        setCollapsed,
        toggleMobileOpen,
        toggleCollapsed,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout context sağlayıcısı (LayoutProvider) içerisinde çağrılmalıdır.");
  }
  return context;
};
