import React from "react";
import { Box } from "ink";
import { FileSelector } from "../components/file-selector.js";
import { useCli } from "../app/cli-context.js";

export function SvgConverter() {
  const { exit } = useCli();

  return (
    <Box flexDirection="column">
      <FileSelector onError={exit} />
    </Box>
  );
}
