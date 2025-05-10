import React, { type ReactNode } from "react";
import { Transform } from "ink";
import gradientString from "gradient-string";
import stripAnsi from "strip-ansi";

export type GradientName =
  | "cristal"
  | "teen"
  | "mind"
  | "morning"
  | "vice"
  | "passion"
  | "fruit"
  | "instagram"
  | "atlas"
  | "retro"
  | "summer"
  | "pastel"
  | "rainbow";

export type GradientColors = string[];

// https://github.com/bokub/gradient-string#available-built-in-gradients
// https://github.com/bokub/gradient-string#initialize-a-gradient
export type Props =
  | {
      readonly children: ReactNode;
      readonly name: GradientName;
      readonly colors?: never;
    }
  | {
      readonly children: ReactNode;
      readonly name?: never;
      readonly colors: GradientColors;
    };

/**
 @example
 ```
 import React from 'react';
 import {render} from 'ink';
 import Gradient from 'ink-gradient';
 import BigText from 'ink-big-text';

 render(
 <Gradient name="rainbow">
 <BigText text="unicorns"/>
 </Gradient>
 );
 ```
 */
export function Gradient(props: Props) {
  // Type guard helpers
  const hasName = (p: Props): p is { name: GradientName; children: React.ReactNode } =>
    typeof p.name === "string" && !!p.name;
  const hasColors = (p: Props): p is { colors: string[]; children: React.ReactNode } =>
    Array.isArray((p as any).colors) && !!(p as any).colors.length;

  let gradient: ReturnType<typeof gradientString>;

  if (hasName(props)) {
    const builtIn = gradientString[props.name as GradientName];
    if (!builtIn) {
      throw new Error(
        `[Gradient] Invalid gradient name: '${props.name}'.\nValid names: ${Object.keys(gradientString).join(", ")}`
      );
    }
    gradient = builtIn;
  } else if (hasColors(props)) {
    gradient = gradientString(props.colors);
  } else {
    throw new Error(
      "[Gradient] You must provide either a valid 'name' or a non-empty 'colors' array as props."
    );
  }

  const applyGradient = (text: string) => gradient.multiline(stripAnsi(text));

  return <Transform transform={applyGradient}>{props.children}</Transform>;
}
