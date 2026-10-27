import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PulseFit — Train with purpose. Progress with confidence.",
  description:
    "Build consistency, track your workouts, and make progress you can feel with PulseFit.",
  openGraph: {
    title: "PulseFit — Train with purpose. Progress with confidence.",
    description: "Build consistency, track your workouts, and make progress you can feel.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
