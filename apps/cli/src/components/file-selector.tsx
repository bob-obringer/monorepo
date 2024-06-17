import React, { useState, useEffect } from "react";
import { Box, Text, useInput } from "ink";
import { readdirSync, lstatSync } from "fs";
import path from "path";

export function FileSelector({
  initialPath = ".",
  onError,
}: { initialPath?: string; onError?: (err: Error) => void } = {}) {
  const [error, setError] = useState<Error | null>(null);
  const [currentPath, setCurrentPath] = useState<string>(
    path.resolve(initialPath),
  );
  const [files, setFiles] = useState<string[]>([]);
  const [firstVisibleIndex, setFirstVisibleIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(0);

  useEffect(() => {
    try {
      const dirFiles = readdirSync(currentPath);
      setFiles(["..", ...dirFiles]);
      setError(null);
      setSelectedOptionIndex(0);
      setFirstVisibleIndex(0);
    } catch (err) {
      setError(err as Error);
      if (onError) {
        onError(err as Error);
      }
    }
  }, [currentPath]);

  useInput((_, key) => {
    if (key.downArrow) {
      if (selectedOptionIndex < files.length - 1) {
        setSelectedOptionIndex(selectedOptionIndex + 1);
        if (selectedOptionIndex >= firstVisibleIndex + 19) {
          setFirstVisibleIndex(firstVisibleIndex + 1);
        }
      }
    } else if (key.upArrow) {
      if (selectedOptionIndex > 0) {
        setSelectedOptionIndex(selectedOptionIndex - 1);
        if (selectedOptionIndex < firstVisibleIndex + 1) {
          setFirstVisibleIndex(firstVisibleIndex - 1);
        }
      }
    } else if (key.return) {
      const selectedFile = files[selectedOptionIndex];
      const selectedPath = path.resolve(currentPath, selectedFile!);
      if (selectedFile === "..") {
        setCurrentPath(path.resolve(currentPath, ".."));
      } else if (lstatSync(selectedPath).isDirectory()) {
        setCurrentPath(selectedPath);
      }
    }
  });

  if (error) {
    return <Text color="red">{(error as Error).stack}</Text>;
  }

  return (
    <Box flexDirection="column">
      <Text>{currentPath}</Text>
      {files
        .slice(firstVisibleIndex, firstVisibleIndex + 20)
        .map((file, index) => (
          <Text
            key={file}
            color={
              index + firstVisibleIndex === selectedOptionIndex
                ? "blue"
                : "white"
            }
          >
            {index + firstVisibleIndex === selectedOptionIndex ? "> " : "  "}
            {file}
          </Text>
        ))}
    </Box>
  );
}
