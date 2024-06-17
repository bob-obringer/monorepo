import React from "react";
import figlet from "figlet";
import { Text } from "ink";

type AsciiProps = {
  font: figlet.Fonts;
  text: string;
};

export function Figlet({ font, text }: AsciiProps) {
  return <Text>{figlet.textSync(text, font)}</Text>;
}
