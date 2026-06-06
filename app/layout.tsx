import type { Metadata, Viewport } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";

const SITE = "https://elarionlabsinc.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Elarion Labs — An AI that evolves with you",
  description:
    "Elarion is an AI-powered health & fitness system that coaches, cheers, and evolves with you. Join the early access waitlist.",
  keywords: [
    "AI fitness coach",
    "personalized health",
    "body scan",
    "AI nutrition",
    "adaptive training",
    "health system",
  ],
  authors: [{ name: "Elarion Labs" }],
  openGraph: {
    title: "Elarion Labs — An AI that evolves with you",
    description:
      "AI-powered health & fitness that coaches, cheers, and evolves with you. Get early access.",
    url: SITE,
    siteName: "Elarion Labs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elarion Labs — An AI that evolves with you",
    description:
      "AI-powered health & fitness that coaches, cheers, and evolves with you.",
  },
  alternates: { canonical: SITE },
};

export const viewport: Viewport = {
  themeColor: "#05060a",
  width: "device-width",
  initialScale: 1,
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Elarion Labs",
  url: SITE,
  description:
    "AI-powered health and fitness system that coaches, cheers, and evolves with you.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body>
        <SmoothScroll />
        <ScrollProgress />
        {children}
        <div className="vignette" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
