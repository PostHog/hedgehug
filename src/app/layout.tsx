import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/lib/auth-context"
import { NameGate } from "@/components/auth/name-gate"
import { ErrorBoundary } from "@/components/error-boundary"
import { I18nProvider } from "@/lib/i18n/context"
import { AppShell } from "@/components/layout/app-shell"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  title: "HedgeHug | Adote um Ouriço",
  description:
    "Centro de resgate e adoção de ouriços em São Paulo. Encontre seu novo companheiro espinhoso.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ErrorBoundary>
          <I18nProvider>
            <AuthProvider>
              <NameGate>
                <AppShell>{children}</AppShell>
              </NameGate>
            </AuthProvider>
          </I18nProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
