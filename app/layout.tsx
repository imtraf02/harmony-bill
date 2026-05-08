import { Dancing_Script, Playfair_Display, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin', 'vietnamese'], variable: '--font-sans' })
const dancingScript = Dancing_Script({ subsets: ['latin', 'vietnamese'], variable: '--font-dancing' })
const playfair = Playfair_Display({ subsets: ['latin', 'vietnamese'], variable: '--font-playfair' })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={cn("antialiased", inter.variable, dancingScript.variable, playfair.variable)}
    >
      <body className={cn("min-h-screen bg-background font-playfair", inter.variable, dancingScript.variable, playfair.variable)}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
