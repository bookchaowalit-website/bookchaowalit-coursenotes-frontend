import type { Metadata } from "next";
import { DM_Mono, DM_Sans, Newsreader } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const studySans = DM_Sans({ variable: "--font-study-sans", subsets: ["latin"] });
const studyMono = DM_Mono({ variable: "--font-study-mono", subsets: ["latin"], weight: ["400", "500"] });
const studyDisplay = Newsreader({ variable: "--font-study-display", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Field Notes — Course study archive",
  description: "A personal archive of course notes, topics, sources, and study details.",
  metadataBase: new URL("https://coursenotes.bookchaowalit.com"),
  alternates: { canonical: "https://coursenotes.bookchaowalit.com" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={studySans.variable + " " + studyMono.variable + " " + studyDisplay.variable}><body><Analytics /><SpeedInsights />{children}</body></html>;
}
