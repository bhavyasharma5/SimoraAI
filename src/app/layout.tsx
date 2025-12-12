import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Simora AI - Auto-generate Beautiful Video Captions",
  description: "Upload your video, let AI transcribe the audio, and render stunning captions with multiple styles. Perfect for Hinglish content!",
  keywords: ["video captions", "AI transcription", "Hinglish", "Remotion", "Whisper AI", "subtitle generator"],
  authors: [{ name: "Simora AI" }],
  openGraph: {
    title: "Simora AI - Auto-generate Beautiful Video Captions",
    description: "Upload your video, let AI transcribe the audio, and render stunning captions with multiple styles.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Simora AI - Auto-generate Beautiful Video Captions",
    description: "Upload your video, let AI transcribe the audio, and render stunning captions with multiple styles.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
