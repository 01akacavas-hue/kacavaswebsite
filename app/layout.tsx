import type { Metadata, Viewport } from "next"
import { Cormorant_Garamond, Geist_Mono, Source_Sans_3 } from "next/font/google"
import { JsonLd } from "@/components/seo/json-ld"
import { SITE_URL } from "@/lib/site"
import "./globals.css"

const sans = Source_Sans_3({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
})

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
})

const serif = Cormorant_Garamond({
  weight: ["500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Kacavas — Eli, Niko, and Alec",
    template: "%s — Kacavas",
  },
  description:
    "Elias, Nicholas, and Alec Kacavas. An actor, a U.S. Army captain, and a GTM lead, from Manchester, New Hampshire.",
  applicationName: "Kacavas",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Kacavas",
  },
  twitter: {
    card: "summary_large_image",
  },
}

export const viewport: Viewport = {
  themeColor: "#f7f3ec",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable} h-full antialiased`}>
      <body className="min-h-full bg-ink text-paper">
        <JsonLd />
        {children}
      </body>
    </html>
  )
}
