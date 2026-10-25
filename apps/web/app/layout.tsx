import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Louve Invest · Marché secondaire des SCPI",
  description: "Analyse des opportunités d'investissement sur le marché secondaire des SCPI",
};

export interface IRootLayoutProps {
  children: ReactNode;
}

export default function RootLayout(props: IRootLayoutProps) {
  return (
    <html lang="fr" className={`${spaceGrotesk.variable} ${spaceGrotesk.className} h-full antialiased`}>
      <body className="min-h-full bg-louve-bg text-louve-navy">
        <Providers>{props.children}</Providers>
      </body>
    </html>
  );
}
