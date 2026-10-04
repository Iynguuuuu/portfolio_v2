import type { Metadata } from "next";
import { MuseoModerno } from "next/font/google";
import "./globals.css";

const museoModerno = MuseoModerno({
  variable: "--font-museo",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Iynkaran Pavanantham | Software Engineer",
  description:
    "Software Engineer crafting full-stack web, mobile, and AI-driven systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${museoModerno.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-museo">
        {children}
      </body>
    </html>
  );
}
