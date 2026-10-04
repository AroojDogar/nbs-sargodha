import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import BackToTop from "@/components/BackToTop";
import Chatbot from "@/components/Chatbot";
import { school } from "@/data/school";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

const description =
  "Business education from BBA to PhD at the University of Sargodha: management, finance, commerce, analytics and entrepreneurship.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Malik Firoz Khan Noon Business School | University of Sargodha",
  description,
  keywords: [
    "Noon Business School",
    "NBS Sargodha",
    "University of Sargodha",
    "BBA Sargodha",
    "MBA Sargodha",
    "Business school Pakistan",
  ],
  openGraph: {
    type: "website",
    siteName: school.name,
    title: school.name,
    description,
    locale: "en_PK",
  },
  twitter: { card: "summary_large_image", title: school.name, description },
};

// Structured data so search engines understand who the school is.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollegeOrUniversity",
  name: school.name,
  alternateName: school.abbreviation,
  url: siteUrl,
  logo: `${siteUrl}/nbs-logo.png`,
  email: school.contact.email,
  telephone: school.contact.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Ibn-e-Rushd Block, University of Sargodha",
    addressLocality: "Sargodha",
    addressRegion: "Punjab",
    addressCountry: "PK",
  },
  parentOrganization: { "@type": "CollegeOrUniversity", name: school.university, url: "https://www.su.edu.pk" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${bricolage.variable} ${instrument.variable} antialiased`}>
      <body className="font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
        <BackToTop />
        <Chatbot />
      </body>
    </html>
  );
}
