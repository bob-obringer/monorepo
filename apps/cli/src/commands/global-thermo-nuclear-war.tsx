// src/GlobalThermonuclearWar.tsx
import React, { useState } from "react";
import { Box, Text, useApp, useInput } from "ink";

interface Option {
  label: string;
  nextId: number | null;
}

interface Scenario {
  id: number;
  description: string;
  options: Option[];
}

const scenarios: Scenario[] = [
  {
    id: 1,
    description: "Welcome to Global Thermonuclear War. Would you like to play?",
    options: [
      { label: "Yes", nextId: 2 },
      { label: "No", nextId: 3 },
    ],
  },
  {
    id: 2,
    description: "Choose your side:",
    options: [
      { label: "USA", nextId: 4 },
      { label: "USSR", nextId: 5 },
    ],
  },
  {
    id: 3,
    description: "You have exited the game. No war today.",
    options: [{ label: "Restart", nextId: 1 }],
  },
  {
    id: 4,
    description: "You have chosen the USA. What is your first action?",
    options: [
      { label: "Deploy troops to Europe", nextId: 6 },
      { label: "Deploy naval blockade", nextId: 7 },
      { label: "Launch preemptive strike", nextId: 8 },
    ],
  },
  {
    id: 5,
    description: "You have chosen the USSR. What is your first action?",
    options: [
      { label: "Deploy troops to Eastern Europe", nextId: 9 },
      { label: "Deploy naval blockade", nextId: 10 },
      { label: "Launch preemptive strike", nextId: 11 },
    ],
  },
  {
    id: 6,
    description:
      "Troops deployed to Europe. NATO allies support. Increase tension, or attempt diplomacy?",
    options: [
      { label: "Increase tension", nextId: 8 },
      { label: "Attempt diplomacy", nextId: 12 },
    ],
  },
  {
    id: 7,
    description:
      "Naval blockade in place. USSR responds with similar measures. Prepare for escalation or back down?",
    options: [
      { label: "Prepare for escalation", nextId: 8 },
      { label: "Back down", nextId: 12 },
    ],
  },
  {
    id: 8,
    description:
      "Preemptive strike initiated. Retaliation from the USSR. Widespread destruction. Game Over.",
    options: [{ label: "Restart", nextId: 1 }],
  },
  {
    id: 9,
    description:
      "Troops deployed to Eastern Europe. Warsaw Pact supports. Increase tension, or attempt diplomacy?",
    options: [
      { label: "Increase tension", nextId: 11 },
      { label: "Attempt diplomacy", nextId: 13 },
    ],
  },
  {
    id: 10,
    description:
      "Naval blockade in place. USA responds with similar measures. Prepare for escalation or back down?",
    options: [
      { label: "Prepare for escalation", nextId: 11 },
      { label: "Back down", nextId: 13 },
    ],
  },
  {
    id: 11,
    description:
      "Preemptive strike initiated. Retaliation from the USA. Widespread destruction. Game Over.",
    options: [{ label: "Restart", nextId: 1 }],
  },
  {
    id: 12,
    description:
      "Diplomatic negotiations begin, but tensions remain high. Do you want to continue talks or prepare for conflict?",
    options: [
      { label: "Continue talks", nextId: 14 },
      { label: "Prepare for conflict", nextId: 8 },
    ],
  },
  {
    id: 13,
    description:
      "Diplomatic negotiations begin, but tensions remain high. Do you want to continue talks or prepare for conflict?",
    options: [
      { label: "Continue talks", nextId: 15 },
      { label: "Prepare for conflict", nextId: 11 },
    ],
  },
  {
    id: 14,
    description:
      "Talks result in an uneasy truce. Cold War tensions persist, but direct conflict is avoided. You win... for now.",
    options: [{ label: "Restart", nextId: 1 }],
  },
  {
    id: 15,
    description:
      "Talks result in an uneasy truce. Cold War tensions persist, but direct conflict is avoided. You win... for now.",
    options: [{ label: "Restart", nextId: 1 }],
  },
];

export function GlobalThermonuclearWar() {
  const { exit } = useApp();
  const [currentScenarioId, setCurrentScenarioId] = useState<number>(1);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(0);
  const [exitMessage, setExitMessage] = useState<string | null>(null);

  const currentScenario = scenarios.find((s) => s.id === currentScenarioId)!;

  useInput((input, key) => {
    if (input.toLowerCase() === "q" || key.escape) {
      setExitMessage("Game exited. Goodbye!");
    } else if (exitMessage) {
      exit();
    } else if (key.upArrow) {
      setSelectedOptionIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (key.downArrow) {
      setSelectedOptionIndex((prev) =>
        prev < currentScenario.options.length - 1 ? prev + 1 : prev,
      );
    } else if (key.return) {
      const nextId = currentScenario.options[selectedOptionIndex]!.nextId;
      if (nextId !== null) {
        setCurrentScenarioId(nextId);
        setSelectedOptionIndex(0);
      }
    }
  });

  if (exitMessage) {
    return (
      <Box flexDirection="column">
        <Text>{exitMessage}</Text>
        <Text>Press any key to exit...</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Text>{currentScenario.description}</Text>
      {currentScenario.options.map((option, index) => (
        <Text
          key={index}
          color={index === selectedOptionIndex ? "blue" : "white"}
        >
          {index === selectedOptionIndex ? "> " : "  "}
          {option.label}
        </Text>
      ))}
    </Box>
  );
}
