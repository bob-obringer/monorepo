import React from "react";
import { Box, Text } from "ink";

interface ProgressBarProps {
  value: number; // completed jobs
  total: number; // total jobs
  width?: number; // width of the bar in chars
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, total, width = 30 }) => {
  const pct = total === 0 ? 0 : Math.min(1, value / total);
  const filled = Math.round(width * pct);
  const empty = width - filled;
  return (
    <Box>
      <Text color="green">[{"#".repeat(filled)}</Text>
      <Text color="gray">{"-".repeat(empty)}]</Text>
      <Text color="cyan"> {value}/{total}</Text>
    </Box>
  );
};
