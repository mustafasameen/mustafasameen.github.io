import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Footer from "@/components/footer";
import { Header } from "@/components/header";
import { SITE_URL } from "./site";
import { ThemeProvider } from "./theme-provider";

const inter = Inter({ subsets: ["latin"] });

const description =
  "PhD student at the University of Florida building agentic AI systems and multi-agent simulations for transportation.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mustafa Sameen - PhD Student",
    template: "%s | Mustafa Sameen",
  },
  description,
  openGraph: {
    title: "Mustafa Sameen - PhD Student",
    description,
    url: SITE_URL,
    siteName: "Mustafa Sameen",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Mustafa Sameen — PhD Student, University of Florida",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "Mustafa Sameen",
    description,
    card: "summary_large_image",
    site: "@mustafasameen",
    creator: "@mustafasameen",
    images: ["/og.png"],
  },
  verification: {
    google: "K1pkJ72cY3DylswXke2MHJGxmjJ91WXwgozcCICvFrU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-zinc-50 dark:bg-zinc-950 overflow-y-scroll`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="antialiased lg:max-w-2xl md:max-w-full mx-4 mb-12 flex flex-col md:flex-row mt-2 sm:mt-8 lg:mx-auto">
            <section className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
              <Header />
              {children}
              <Footer />
            </section>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
