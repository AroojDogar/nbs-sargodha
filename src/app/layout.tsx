import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Malik Firoz Khan Noon Business School | University of Sargodha",
  description:
    "Business education from BBA to PhD at the University of Sargodha: management, finance, commerce, analytics and entrepreneurship.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${bricolage.variable} ${instrument.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
