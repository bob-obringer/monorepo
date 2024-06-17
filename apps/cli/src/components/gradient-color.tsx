import React, { type ReactNode } from "react";
import { Transform } from "ink";
import gradientString, {
  type Gradient as GradientStringType,
  PositionedColorInput,
} from "gradient-string";
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

export type GradientColors = PositionedColorInput[];

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
  let gradient: GradientStringType;
  if (props.name) {
    gradient = gradientString[props.name];
  } else {
    gradient = gradientString(props.colors);
  }

  const applyGradient = (text: string) => gradient.multiline(stripAnsi(text));

  return <Transform transform={applyGradient}>{props.children}</Transform>;
}
