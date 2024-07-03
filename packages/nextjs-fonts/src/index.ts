import { Montserrat, Reddit_Mono, Ysabeau_SC } from "next/font/google";

const display = Ysabeau_SC({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const body = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const mono = Reddit_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const fontClasses = [
  body.className,
  body.variable,
  display.variable,
  mono.variable,
].join(" ");
