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
