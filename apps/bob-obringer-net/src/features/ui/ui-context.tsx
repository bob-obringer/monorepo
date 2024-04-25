"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type UIContextType = {
  viewportWidth: number | null;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UiContextProvider({ children }: { children: ReactNode }) {
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
    <UIContext.Provider value={{ viewportWidth }}>
      {children}
    </UIContext.Provider>
  );
}

export const useUiContext = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error("useUiContext must be used within a UIContext");
  }
  return context;
};
