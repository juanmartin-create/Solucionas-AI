import type { Metadata } from "next";
import { Newsreader, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${SITE.fullName} · ${SITE.tagline}`,
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  openGraph: {
    title: `${SITE.fullName} · ${SITE.tagline}`,
    description: SITE.description,
    locale: SITE.locale,
    type: "website",
    siteName: SITE.fullName,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-AR"
      className={`${newsreader.variable} ${instrument.variable} antialiased`}
    >
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
