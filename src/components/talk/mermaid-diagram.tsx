"use client"

import { useEffect, useRef, useState } from "react"
import mermaid from "mermaid"

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  themeVariables: {
    darkMode: true,
    background: "#151515",
    primaryColor: "#F9BD2B",
    primaryTextColor: "#EEEFE9",
    primaryBorderColor: "#F9BD2B",
    secondaryColor: "#1D4AFF",
    secondaryTextColor: "#EEEFE9",
    secondaryBorderColor: "#1D4AFF",
    tertiaryColor: "#F54E00",
    tertiaryTextColor: "#EEEFE9",
    tertiaryBorderColor: "#F54E00",
    lineColor: "#EEEFE9",
    textColor: "#EEEFE9",
    mainBkg: "#1a1a2e",
    nodeBorder: "#F9BD2B",
    clusterBkg: "#1a1a2e",
    clusterBorder: "#EEEFE9",
    titleColor: "#F9BD2B",
    edgeLabelBackground: "#151515",
    nodeTextColor: "#EEEFE9",
  },
  flowchart: {
    htmlLabels: true,
    curve: "basis",
  },
  fontFamily: "Inter, sans-serif",
})

let idCounter = 0

export function MermaidDiagram({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState("")
  const idRef = useRef(`mermaid-${idCounter++}`)

  useEffect(() => {
    let cancelled = false

    async function render() {
      try {
        const { svg: rendered } = await mermaid.render(idRef.current, chart)
        if (!cancelled) setSvg(rendered)
      } catch {
        // If mermaid fails, show the raw chart text
        if (!cancelled) setSvg("")
      }
    }

    render()
    return () => {
      cancelled = true
    }
  }, [chart])

  if (!svg) {
    return (
      <pre className="bg-[#1a1a2e] rounded-lg p-4 text-sm font-mono overflow-x-auto mb-4 text-[#EEEFE9]/70">
        {chart}
      </pre>
    )
  }

  return (
    <div
      ref={ref}
      className="my-6 flex justify-center [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
