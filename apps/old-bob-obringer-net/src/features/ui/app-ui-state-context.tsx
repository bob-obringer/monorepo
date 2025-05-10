"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type AppUIContext = {
  viewportWidth: number | null;
};

const AppUIContext = createContext<AppUIContext | undefined>(undefined);

export function AppUIProvider({ children }: { children: ReactNode }) {
  const [viewportWidth, setViewportWidth] = useState<number | null>(null);

  const handleResize = useCallback(function handleResize() {
    setViewportWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  return (
    <AppUIContext.Provider value={{ viewportWidth }}>
      {children}
    </AppUIContext.Provider>
  );
}

export const useAppUI = () => {
  const context = useContext(AppUIContext);
  if (context === undefined) {
    throw new Error("useUiContext must be used within a UIContext");
  }
  return context;
};
