import { render } from "ink";
import React, { type ReactNode } from "react";
import { CliContextProvider } from "./cli-context.js";

export function renderApp(children: ReactNode) {
  return render(<CliContextProvider>{children}</CliContextProvider>);
}
