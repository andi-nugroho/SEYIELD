import type React from "react"
import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { TourProvider } from "@/components/tour/tour-provider"
import { Web3Provider } from "@/components/web3/RainbowKitProvider"

const outfit = Outfit({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SEYRO | Buy Now, Pay Never",
  description: "The first Buy Now Pay Never DeFi platform on SEI Network",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={outfit.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Web3Provider>
            <TourProvider>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </TourProvider>
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  )
}
