import localFont from "next/font/local";

export const bodyFont = localFont({
  src: "../app/fonts/dm-sans-latin.woff2",
  variable: "--font-body",
  weight: "400 700",
  style: "normal",
  display: "swap",
});

export const headingFont = localFont({
  src: "../app/fonts/bricolage-grotesque-latin.woff2",
  variable: "--font-heading",
  weight: "400 800",
  style: "normal",
  display: "swap",
});
