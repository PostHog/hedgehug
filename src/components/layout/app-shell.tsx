"use client"

import { usePathname } from "next/navigation"
import { Header } from "./header"
import { Footer } from "./footer"
import { ChatWidget } from "@/components/chat/chat-widget"

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isTalk = pathname?.startsWith("/talk")

  if (isTalk) return <>{children}</>

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatWidget />
    </>
  )
}
