import "./globals.css";
import { Inter, Roboto_Mono } from "next/font/google";
import dynamic from "next/dynamic";
import { ManualLoaderProvider } from "@/context/ManualLoaderContext";
import { AudioCueProvider } from "@/context/AudioCueContext";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

const geistSans = Inter({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const LoaderManager = dynamic(() => import("@/components/LoaderManager"), {
  ssr: false,
});

export const metadata = {
  title: "AabPashi",
  description: "Smart irrigation insights for farmers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ManualLoaderProvider>
          <LoaderManager />
          <AudioCueProvider>{children}</AudioCueProvider>
        </ManualLoaderProvider>

        <Analytics/>
        <SpeedInsights />
      </body>
    </html>
  );
}
