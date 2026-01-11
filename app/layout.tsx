import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Michael Campbell | Portfolio",
  description: "Portfolio and resume site for Michael Campbell.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <nav
        style={{
          padding: 16,
          borderBottom: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 18 }}>
          Michael Campbell
        </div>

        <nav style={{ padding: 16, borderBottom: "1px solid #ddd" }}>
          <Link href="/" style={{ marginRight: 16 }}>Home</Link>
          <Link href="/about" style={{ marginRight: 16 }}>About</Link>
          <Link href="/resume" style={{ marginRight: 16 }}>Resume</Link>
          <Link href="/projects">Projects</Link>
        </nav>
      </nav>
        {children}
      </body>
    </html>
  );
}
