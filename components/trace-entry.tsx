"use client"
import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import type { TraceEntry } from "@/lib/types"
import { CodeViewer } from "./code-viewer"

interface TraceEntryProps {
  entry: TraceEntry
  projectRoot: string
  depth: number
}

export function TraceEntryComponent({ entry, projectRoot, depth }: TraceEntryProps) {
  const [isCodeOpen, setIsCodeOpen] = useState(false)

  // Only show entries where file includes project root
  const shouldDisplay = entry.file.includes(projectRoot)

  if (!shouldDisplay) {
    // Still render children if they should be displayed
    return (
      <>
        {entry.children?.map((child, index) => (
          <TraceEntryComponent key={index} entry={child} projectRoot={projectRoot} depth={depth} />
        ))}
      </>
    )
  }

  // Get relative path by removing project root
  const relativePath = entry.file.replace(projectRoot, "").replace(/^\//, "")

  // Format the display text
  const displayText = entry.function ? `${relativePath}:${entry.function}` : `${relativePath}:line ${entry.line}`

  const hasChildren = entry.children && entry.children.length > 0

  return (
    <div className="font-mono text-sm">
      <div
        className="flex items-start gap-2 py-1 px-2 hover:bg-secondary/50 rounded cursor-pointer group"
        style={{ paddingLeft: `${depth * 1.5 + 0.5}rem` }}
        onClick={() => setIsCodeOpen(!isCodeOpen)}
      >
        <div className="flex items-center gap-1 flex-shrink-0 pt-0.5">
          {hasChildren && (
            <span className="text-muted-foreground">
              {isCodeOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </span>
          )}
          {!hasChildren && <span className="w-3" />}
        </div>
        <div className="flex-1 min-w-0">
          <span className={entry.call ? "text-green-400" : "text-foreground"}>
            {entry.call && <span className="text-green-400 mr-2">CALL</span>}
            <span className="break-all">{displayText}</span>
          </span>
        </div>
      </div>

      {isCodeOpen && <CodeViewer filePath={entry.file} line={entry.line} depth={depth} />}

      {hasChildren &&
        entry.children?.map((child, index) => (
          <TraceEntryComponent key={index} entry={child} projectRoot={projectRoot} depth={depth + 1} />
        ))}
    </div>
  )
}
