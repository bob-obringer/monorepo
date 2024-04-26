import { Montserrat, Reddit_Mono, Ysabeau_SC } from "next/font/google";

const display = Ysabeau_SC({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-expanded",
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

export const bobObringerFontClasses = [
  body.className,
  body.variable,
  display.variable,
  mono.variable,
].join(" ");
