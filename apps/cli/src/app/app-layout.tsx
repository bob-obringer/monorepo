import React, { type ReactNode } from "react";
import { Box } from "ink";
import { Gradient } from "../components/gradient-color.js";
import { Figlet } from "../components/figlet.js";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <Box
      borderColor="gray"
      borderStyle="classic"
      flexDirection="column"
      padding={1}
    >
      <Box paddingBottom={1}>
        <Gradient name="summer">
          <Figlet text="Greetings, Bob" font="Big" />
        </Gradient>
      </Box>
      {children}
    </Box>
  );
}
