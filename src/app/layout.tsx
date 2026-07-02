import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kherwal Bazaar - Payment Reminder",
    template: "%s | Kherwal Bazaar",
  },
  description: "Track pending dues and send payment reminders effortlessly.",
  manifest: "/manifest.webmanifest",
  applicationName: "Payment Reminder",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Payment Reminder",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Kherwal Bazaar - Payment Reminder",
    description: "Track pending dues and send payment reminders effortlessly.",
    type: "website",
    url: "https://example.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kherwal Bazaar - Payment Reminder",
    description: "Track pending dues and send payment reminders effortlessly.",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563EB",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Payment Reminder" />
      </head>
      <body className={`${plusJakartaSans.className} flex justify-center items-center min-h-screen p-4`}>
        {children}
      </body>
    </html>
  );
}
