import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import "./globals.css";

import { Poppins } from 'next/font/google';

// Load Poppins with specific weights and subsets
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Adjust as needed
  variable: '--font-poppins',
});

const interSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const interMono = Inter({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chromatic",
  description: "AI powered Image Engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`dark ${poppins.variable} font-sans`}>
        <body className={`dark ${poppins.variable} font-sans antialiased`}>
          <header>
            {/* <SignedOut>
              <SignInButton />
            </SignedOut> */}
            {/* <SignedIn>
              <UserButton />
            </SignedIn> */}
          </header>
          <SidebarProvider>
            <AppSidebar />
            <main>
              <SidebarTrigger />
              {children}
            </main>
          </SidebarProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

