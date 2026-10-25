import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingIndicator from "../components/LoadingIndicator";

export const metadata: Metadata = {
  title: "STANDS Conference Facilities",
  description: "Manage all your events in one place",
};

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          {children}
          <Footer />
          <Suspense fallback={null}>
            <LoadingIndicator />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
