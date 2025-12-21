import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WishPay",
  description: "Track your Needs and Wants savings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${poppins.variable} ${inter.variable} antialiased bg-slate-100 min-h-screen font-inter text-slate-800 flex justify-center`}
      >
        <Providers>
          <main className="w-full max-w-md bg-gray-50 min-h-screen relative shadow-2xl overflow-x-hidden">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}