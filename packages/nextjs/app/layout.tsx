import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hedera Pyth Price Guard",
  description: "Pyth-powered circuit breaker starter for Hedera dApps",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
