"use client"

import { useState, useEffect, useCallback } from "react"
import ReactMarkdown from "react-markdown"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { MermaidDiagram } from "./mermaid-diagram"
import { IntroSlide } from "./intro-slide"

interface Slide {
  filename: string
  content: string
}

interface ParsedSlide {
  meta: Record<string, string>
  body: string
}

function parseFrontmatter(content: string): ParsedSlide {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) return { meta: {}, body: content }
  const meta: Record<string, string> = {}
  match[1].split("\n").forEach((line) => {
    const colonIdx = line.indexOf(":")
    if (colonIdx === -1) return
    const key = line.slice(0, colonIdx).trim()
    const value = line.slice(colonIdx + 1).trim()
    if (key) meta[key] = value
  })
  return { meta, body: match[2] }
}

export function SlideViewer({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0)

  const goNext = useCallback(() => {
    setCurrent((c) => Math.min(c + 1, slides.length - 1))
  }, [slides.length])

  const goPrev = useCallback(() => {
    setCurrent((c) => Math.max(c - 1, 0))
  }, [])

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault()
        goNext()
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        goPrev()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [goNext, goPrev])

  // Touch/swipe navigation
  useEffect(() => {
    let startX = 0
    function onTouchStart(e: TouchEvent) {
      startX = e.touches[0].clientX
    }
    function onTouchEnd(e: TouchEvent) {
      const diff = startX - e.changedTouches[0].clientX
      if (Math.abs(diff) > 60) {
        if (diff > 0) goNext()
        else goPrev()
      }
    }
    window.addEventListener("touchstart", onTouchStart)
    window.addEventListener("touchend", onTouchEnd)
    return () => {
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchend", onTouchEnd)
    }
  }, [goNext, goPrev])

  const slide = slides[current]
  const parsed = parseFrontmatter(slide.content)
  const isIntro = parsed.meta.layout === "intro"

  if (isIntro) {
    return (
      <div className="fixed inset-0 select-none">
        <IntroSlide
          title={parsed.meta.title || ""}
          subtitle={parsed.meta.subtitle}
          name={parsed.meta.name || ""}
          role={parsed.meta.role || ""}
          mascotSrc={parsed.meta.mascot}
        />
        <SlideNav
          current={current}
          total={slides.length}
          onPrev={goPrev}
          onNext={goNext}
          onJump={setCurrent}
          theme="light"
        />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-[#151515] text-[#EEEFE9] flex flex-col select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 shrink-0">
        <div className="flex items-center gap-3">
          <Image src="/hedgehog.svg" alt="HedgeHug" width={32} height={19} />
          <span className="text-sm font-semibold text-[#EEEFE9]/70">
            HedgeHug
          </span>
        </div>
        <div className="text-sm text-[#EEEFE9]/50 font-mono">
          {current + 1} / {slides.length}
        </div>
      </div>

      {/* Slide content */}
      <div className="flex-1 overflow-y-auto px-6 sm:px-12 lg:px-24 pb-24">
        <div className="max-w-3xl mx-auto slide-content">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl sm:text-5xl font-extrabold mb-6 leading-tight text-[#F9BD2B]">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-4 text-[#EEEFE9]">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg sm:text-xl font-semibold mt-6 mb-3 text-[#F9BD2B]/80">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-base sm:text-lg leading-relaxed mb-4 text-[#EEEFE9]/80">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-6 mb-4 space-y-2 text-[#EEEFE9]/80">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-6 mb-4 space-y-2 text-[#EEEFE9]/80">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-base sm:text-lg leading-relaxed">
                  {children}
                </li>
              ),
              strong: ({ children }) => (
                <strong className="font-bold text-[#EEEFE9]">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="italic text-[#F9BD2B]/70">{children}</em>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-[#F54E00] pl-4 my-4 text-[#EEEFE9]/60 italic">
                  {children}
                </blockquote>
              ),
              code: ({ children, className }) => {
                const isMermaid = className?.includes("language-mermaid")
                if (isMermaid) {
                  const chart = String(children).replace(/\n$/, "")
                  return <MermaidDiagram chart={chart} />
                }
                const isBlock = className?.includes("language-")
                if (isBlock) {
                  return (
                    <code className="block bg-[#1a1a2e] rounded-lg p-4 text-sm font-mono overflow-x-auto mb-4 text-[#EEEFE9]/90 leading-relaxed">
                      {children}
                    </code>
                  )
                }
                return (
                  <code className="bg-[#EEEFE9]/10 rounded px-1.5 py-0.5 text-sm font-mono text-[#F9BD2B]">
                    {children}
                  </code>
                )
              },
              pre: ({ children }) => <pre className="mb-4">{children}</pre>,
              img: ({ src, alt }) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={src}
                  alt={alt || ""}
                  className="mx-auto my-6 max-h-[40vh]"
                />
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1D4AFF] underline underline-offset-2 hover:text-[#6e8cf9]"
                >
                  {children}
                </a>
              ),
              hr: () => (
                <hr className="border-[#EEEFE9]/10 my-8" />
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-sm border-collapse">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="border-b border-[#EEEFE9]/20">
                  {children}
                </thead>
              ),
              th: ({ children }) => (
                <th className="text-left py-2 px-3 font-semibold text-[#F9BD2B]/80">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="py-2 px-3 border-b border-[#EEEFE9]/5 text-[#EEEFE9]/70">
                  {children}
                </td>
              ),
              input: ({ checked, ...props }) => (
                <input
                  {...props}
                  checked={checked}
                  readOnly
                  className="mr-2 accent-[#F9BD2B]"
                />
              ),
            }}
          >
            {parsed.body}
          </ReactMarkdown>
        </div>
      </div>

      <SlideNav
        current={current}
        total={slides.length}
        onPrev={goPrev}
        onNext={goNext}
        onJump={setCurrent}
        theme="dark"
      />
    </div>
  )
}

function SlideNav({
  current,
  total,
  onPrev,
  onNext,
  onJump,
  theme,
}: {
  current: number
  total: number
  onPrev: () => void
  onNext: () => void
  onJump: (i: number) => void
  theme: "dark" | "light"
}) {
  const isDark = theme === "dark"
  const btnBase = isDark
    ? "bg-[#EEEFE9]/10 hover:bg-[#EEEFE9]/20 text-[#EEEFE9]"
    : "bg-[#151515]/10 hover:bg-[#151515]/20 text-[#151515]"
  const segActive = isDark ? "bg-[#F9BD2B]" : "bg-[#F54E00]"
  const segPast = isDark ? "bg-[#EEEFE9]/30" : "bg-[#151515]/30"
  const segFuture = isDark ? "bg-[#EEEFE9]/10" : "bg-[#151515]/10"
  const gradient = isDark
    ? "bg-gradient-to-t from-[#151515] via-[#151515]/80 to-transparent"
    : "bg-gradient-to-t from-[#EEEFE9] via-[#EEEFE9]/80 to-transparent"

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-4 pointer-events-none ${gradient}`}
    >
      <button
        onClick={onPrev}
        disabled={current === 0}
        className={`pointer-events-auto p-3 rounded-full disabled:opacity-20 transition-colors ${btnBase}`}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div className="flex-1 mx-6 pointer-events-auto">
        <div className="flex gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => onJump(i)}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i === current ? segActive : i < current ? segPast : segFuture
              }`}
            />
          ))}
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={current === total - 1}
        className={`pointer-events-auto p-3 rounded-full disabled:opacity-20 transition-colors ${btnBase}`}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}
