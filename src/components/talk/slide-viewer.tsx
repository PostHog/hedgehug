"use client"

import { useState, useEffect, useCallback } from "react"
import ReactMarkdown from "react-markdown"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { MermaidDiagram } from "./mermaid-diagram"

interface Slide {
  filename: string
  content: string
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
            {slide.content}
          </ReactMarkdown>
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-4 bg-gradient-to-t from-[#151515] via-[#151515] to-transparent pointer-events-none">
        <button
          onClick={goPrev}
          disabled={current === 0}
          className="pointer-events-auto p-3 rounded-full bg-[#EEEFE9]/10 hover:bg-[#EEEFE9]/20 disabled:opacity-20 disabled:hover:bg-[#EEEFE9]/10 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Progress bar */}
        <div className="flex-1 mx-6 pointer-events-auto">
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i === current
                    ? "bg-[#F9BD2B]"
                    : i < current
                      ? "bg-[#EEEFE9]/30"
                      : "bg-[#EEEFE9]/10"
                }`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={goNext}
          disabled={current === slides.length - 1}
          className="pointer-events-auto p-3 rounded-full bg-[#EEEFE9]/10 hover:bg-[#EEEFE9]/20 disabled:opacity-20 disabled:hover:bg-[#EEEFE9]/10 transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
