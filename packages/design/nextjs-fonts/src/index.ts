import { Unbounded, Montserrat, Reddit_Mono } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const unbounded = Unbounded({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-expanded",
});

const redditMono = Reddit_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const bobObringerFontClasses = [
  montserrat.className,
  montserrat.variable,
  unbounded.variable,
  redditMono.variable,
].join(" ");
