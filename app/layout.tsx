import "./globals.css";
import { Inter, Roboto_Mono } from "next/font/google";
import LoaderManager from "@/components/LoaderManager";
import { ManualLoaderProvider } from "@/context/ManualLoaderContext";
import { AudioCueProvider } from "@/context/AudioCueContext";

const geistSans = Inter({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      </body>
    </html>
  );
}
