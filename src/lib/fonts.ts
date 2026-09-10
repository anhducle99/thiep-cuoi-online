import {
  Playfair_Display,
  EB_Garamond,
  Alex_Brush,
  Libre_Baskerville,
  Be_Vietnam_Pro,
  Lora,
  Dancing_Script,
} from "next/font/google";

export const fontDisplay = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const fontSerif = EB_Garamond({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
  display: "swap",
});

export const fontClassic = Libre_Baskerville({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  variable: "--font-classic",
  display: "swap",
});

export const fontScript = Alex_Brush({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-script",
  display: "swap",
});

export const fontSans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const fontLora = Lora({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora",
  display: "swap",
});

export const fontDancing = Dancing_Script({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "700"],
  variable: "--font-dancing",
  display: "swap",
});

export const fontVariables = [
  fontDisplay.variable,
  fontSerif.variable,
  fontClassic.variable,
  fontScript.variable,
  fontSans.variable,
  fontLora.variable,
  fontDancing.variable,
].join(" ");
