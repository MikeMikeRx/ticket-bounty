import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Header } from "@/app/_navigation/header";
import { Sidebar } from "@/app/_navigation/sidebar";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ReactQueryProvider } from "./_providers/react-query/react-query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  'Ticket Bounty is a full-stack ticket management platform where users post tasks or issues with a monetary bounty attached. The idea is simple: describe a problem, set a deadline and a reward (the "bounty"), and track its progress until it\'s resolved.';

export const metadata: Metadata = {
  title: "Ticket Bounty",
  description,
  openGraph: {
    title: "Ticket Bounty",
    description,
    images: [{ url: "/logo.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ticket Bounty",
    description,
    images: ["/logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NuqsAdapter>
          <ThemeProvider>
            <ReactQueryProvider>
              <Header />
              <div className="flex h-screen overflow-hidden border-collapse">
                <Sidebar />
                <main
                  className="
                      min-h-screen flex-1
                      overflow-y-auto overflow-x-hidden
                      py-24 px-8
                      bg-secondary/20
                      flex flex-col
                      "
                >
                  {children}
                </main>
              </div>
              <Toaster expand />
            </ReactQueryProvider>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
