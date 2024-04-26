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

const UiStateContext = createContext<UIContextType | undefined>(undefined);

export function UiStateProvider({ children }: { children: ReactNode }) {
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
    <UiStateContext.Provider value={{ viewportWidth }}>
      {children}
    </UiStateContext.Provider>
  );
}

export const useUiState = () => {
  const context = useContext(UiStateContext);
  if (context === undefined) {
    throw new Error("useUiContext must be used within a UIContext");
  }
  return context;
};
