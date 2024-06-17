import { useApp } from "ink";
import React, { ReactNode, useContext, useState } from "react";

const CliContext = React.createContext<{
  commandName: string | null;
  setCommandName: (name: string) => void;
  exit: (error?: Error | undefined) => void;
}>({
  commandName: "",
  setCommandName: () => {},
  exit: () => {},
});

export function CliContextProvider({ children }: { children: ReactNode }) {
  const { exit } = useApp();
  const [commandName, setCommandName] = useState<string | null>(null);

  return (
    <CliContext.Provider value={{ commandName, setCommandName, exit }}>
      {children}
    </CliContext.Provider>
  );
}

export function useCli() {
  return useContext(CliContext);
}
