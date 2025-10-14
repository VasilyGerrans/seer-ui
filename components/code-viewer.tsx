"use client"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

interface CodeViewerProps {
  filePath: string
  line: number
  depth: number
}

interface CodeData {
  html: string
  startLine: number
  targetLine: number
  extension: string
  language: string
}

export function CodeViewer({ filePath, line, depth }: CodeViewerProps) {
  const [codeData, setCodeData] = useState<CodeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCode = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/code?file=${encodeURIComponent(filePath)}&line=${line}`)

        if (!response.ok) {
          throw new Error("Failed to fetch code")
        }

        const data = await response.json()
        setCodeData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load code")
      } finally {
        setLoading(false)
      }
    }

    fetchCode()
  }, [filePath, line])

  if (loading) {
    return (
      <div
        className="ml-6 my-2 p-4 bg-card border border-border rounded flex items-center justify-center"
        style={{ marginLeft: `${depth * 1.5 + 2}rem` }}
      >
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !codeData) {
    return (
      <div
        className="ml-6 my-2 p-4 bg-card border border-border rounded text-destructive text-sm"
        style={{ marginLeft: `${depth * 1.5 + 2}rem` }}
      >
        {error || "Failed to load code"}
      </div>
    )
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(codeData.html, "text/html")
  const preElement = doc.querySelector("pre")
  const codeElement = preElement?.querySelector("code")

  if (!codeElement) {
    return (
      <div
        className="ml-6 my-2 p-4 bg-card border border-border rounded text-destructive text-sm"
        style={{ marginLeft: `${depth * 1.5 + 2}rem` }}
      >
        Failed to parse code
      </div>
    )
  }

  const lines = codeElement.innerHTML.split("\n")

  return (
    <div
      className="my-2 bg-card border border-border rounded overflow-hidden"
      style={{ marginLeft: `${depth * 1.5 + 2}rem` }}
    >
      <div className="bg-secondary px-3 py-1.5 text-xs text-muted-foreground border-b border-border">
        {filePath.split("/").pop()} (lines {codeData.startLine}-{codeData.startLine + lines.length - 1})
      </div>
      <div className="overflow-x-auto">
        <div className="p-3 text-xs leading-relaxed font-mono">
          {lines.map((lineHtml, index) => {
            const lineNumber = codeData.startLine + index
            const isTargetLine = lineNumber === codeData.targetLine
            return (
              <div key={index} className={`flex gap-3 ${isTargetLine ? "bg-accent/10" : ""}`}>
                <span className="text-muted-foreground select-none w-8 text-right flex-shrink-0">{lineNumber}</span>
                <code className="flex-1 whitespace-pre" dangerouslySetInnerHTML={{ __html: lineHtml || " " }} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
