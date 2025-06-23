import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/AuthContext"
import "./globals.css"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ResearchSite - Sites Web pour Chercheurs",
  description: "Créez facilement votre site web de chercheur avec récupération automatique de vos publications",
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
      <Toaster  position="top-center" />
        {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange> */}
        <AuthProvider>
          {children}
        </AuthProvider>
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}
