"use client"
import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import type { TraceEntry } from "@/lib/types"
import { CodeViewer } from "./code-viewer"

interface TraceEntryProps {
  entry: TraceEntry
  projectRoot: string
  depth: number
  programAddress?: string
  isFirstInProgram?: boolean
}

export function TraceEntryComponent({ entry, projectRoot, depth, programAddress, isFirstInProgram }: TraceEntryProps) {
  const [isCodeOpen, setIsCodeOpen] = useState(false)

  const isInProjectRoot = entry.step.file.includes(projectRoot)
  const canShowCode = isInProjectRoot

  // Get relative path by removing project root if present
  const relativePath = entry.step.file.includes(projectRoot)
    ? entry.step.file.replace(projectRoot, "").replace(/^\//, "")
    : entry.step.file

  const functionOrLine = entry.step.function ? entry.step.function : `${entry.step.line}`

  const hasChildren = entry.children && entry.children.length > 0

  return (
    <div className="font-mono text-sm">
      <div
        className={`flex items-start gap-2 py-1 px-2 rounded ${canShowCode ? "hover:bg-secondary/50 cursor-pointer" : ""}`}
        style={{ paddingLeft: `${depth * 1.5 + 0.5}rem` }}
        onClick={() => canShowCode && setIsCodeOpen(!isCodeOpen)}
      >
        <div className="flex items-center gap-1 flex-shrink-0 pt-0.5">
          {canShowCode && (
            <span className="text-muted-foreground">
              {isCodeOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </span>
          )}
          {!canShowCode && <span className="w-3" />}
        </div>

        <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            {entry.step.call && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-accent/20 text-accent border border-accent/30 flex-shrink-0">
                CALL
              </span>
            )}
            <span className={`break-all ${canShowCode ? "text-foreground" : "text-muted-foreground"}`}>
              {relativePath}:
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-muted text-muted-foreground border border-border flex-shrink-0">
              {functionOrLine}
            </span>
          </div>

          {isFirstInProgram && programAddress && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20 flex-shrink-0 ml-auto">
              {programAddress}
            </span>
          )}
        </div>
      </div>

      {isCodeOpen && canShowCode && <CodeViewer filePath={entry.step.file} line={entry.step.line} depth={depth} />}

      {hasChildren &&
        entry.children?.map((child, index) => (
          <TraceEntryComponent
            key={index}
            entry={child}
            projectRoot={projectRoot}
            depth={depth + 1}
            programAddress={programAddress}
            isFirstInProgram={false}
          />
        ))}
    </div>
  )
}
