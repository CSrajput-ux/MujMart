import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import { DemoProvider } from "@/lib/DemoContext";
import { CartProvider } from "@/lib/CartContext";
import { AuthProvider } from "@/lib/AuthContext";
import Script from "next/script";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MUJMart — Buy, Sell, Rent on Campus",
    template: "%s | MUJMart",
  },
  description:
    "MUJMart is the campus-exclusive marketplace for Manipal University Jaipur students. Buy, sell, rent, or give away textbooks, electronics, furniture, and more.",
  keywords: [
    "MUJ",
    "Manipal University Jaipur",
    "campus marketplace",
    "student buy sell",
    "college marketplace",
    "MUJMart",
  ],
  openGraph: {
    title: "MUJMart — Buy, Sell, Rent on Campus",
    description:
      "Campus-exclusive marketplace for MUJ students. Textbooks, electronics, furniture & more.",
    siteName: "MUJMart",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${dmSans.variable} antialiased`}>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />
        <DemoProvider>
          <AuthProvider>
            <CartProvider>{children}</CartProvider>
          </AuthProvider>
        </DemoProvider>
      </body>
    </html>
  );
}
