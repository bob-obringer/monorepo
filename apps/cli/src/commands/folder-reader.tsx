import React from "react";
import { Box, Text } from "ink";
import { readdirSync } from "fs";

interface FolderReaderProps {
  path: string;
}

export function FolderReader({ path }: FolderReaderProps) {
  let files: string[];

  try {
    files = readdirSync(path);
  } catch (err) {
    return <Text color="red">Error: {String(err)}</Text>;
  }

  return (
    <Box flexDirection="column">
      {files.map((file) => (
        <Text key={file}>- {file}</Text>
      ))}
    </Box>
  );
}
