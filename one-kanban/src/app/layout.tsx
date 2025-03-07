import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import Providers from "./providers";

const jakartaPlus = Plus_Jakarta_Sans({
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "OneKanban",
  description: "Easily manage your tasks with OneKanban",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakartaPlus.className}`}>
      <Providers>
        {children}
      </Providers>
    </html>
  );
}
