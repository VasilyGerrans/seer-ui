"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { TransactionFile } from "@/lib/types"
import { TraceEntryComponent } from "@/components/trace-entry"

interface GroupedInstruction {
  instructionNumber: number
  traces: Array<{
    entry: any
    programAddress: string
    isFirstInProgram: boolean
  }>
}

export default function TransactionPage() {
  const params = useParams()
  const router = useRouter()
  const hash = params.hash as string

  const [files, setFiles] = useState<TransactionFile[]>([])
  const [projectRoot, setProjectRoot] = useState<string>("")
  const [programMap, setProgramMap] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [searchHash, setSearchHash] = useState(hash)

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/transaction/${hash}`)
        const data = await response.json()
        setFiles(data.files || [])
        setProjectRoot(data.projectRoot || "")

        if (data.projectRoot) {
          try {
            const mapResponse = await fetch(`/api/program-map?projectRoot=${encodeURIComponent(data.projectRoot)}`)
            const mapData = await mapResponse.json()
            setProgramMap(mapData.map || {})
          } catch (error) {
            console.error("[v0] Error loading program map:", error)
          }
        }
      } catch (error) {
        console.error("[v0] Error fetching transaction:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransaction()
  }, [hash])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchHash.trim() && searchHash !== hash) {
      router.push(`/transaction/${searchHash.trim()}`)
    }
  }

  const groupedInstructions: GroupedInstruction[] = files.reduce((acc, file) => {
    const existingInstruction = acc.find((group) => group.instructionNumber === file.instructionNumber)

    const displayAddress = programMap[file.programAddress] || file.programAddress

    const tracesWithMetadata = file.traces.map((trace, index) => ({
      entry: trace,
      programAddress: `${displayAddress}:${file.programAddress}`,
      isFirstInProgram: index === 0,
    }))

    if (existingInstruction) {
      existingInstruction.traces.push(...tracesWithMetadata)
    } else {
      acc.push({
        instructionNumber: file.instructionNumber,
        traces: tracesWithMetadata,
      })
    }

    return acc
  }, [] as GroupedInstruction[])

  groupedInstructions.sort((a, b) => a.instructionNumber - b.instructionNumber)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="gap-2 hover:bg-secondary">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-xl font-mono font-semibold">Seer Transaction Trace</h1>
          </div>
          <form onSubmit={handleSearch} className="mt-4">
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search another transaction..."
                value={searchHash}
                onChange={(e) => setSearchHash(e.target.value)}
                className="pl-10 font-mono bg-secondary border-border"
              />
            </div>
          </form>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <div className="text-6xl">🔍</div>
            <h2 className="text-2xl font-bold">No Transaction Found</h2>
            <p className="text-muted-foreground">
              No trace files found for transaction hash: <span className="font-mono">{hash}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Make sure the transaction has been traced and the files are in the seer folder.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Transaction Trace</h2>
              <p className="text-muted-foreground font-mono text-sm break-all">{hash}</p>
            </div>

            <div className="space-y-6">
              {groupedInstructions.map((instruction, index) => (
                <div key={index} className="border border-border rounded-lg overflow-hidden bg-card">
                  <div className="bg-secondary px-4 py-3 border-b border-border">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Instruction</span>
                        <span className="font-mono font-semibold">{instruction.instructionNumber}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    {instruction.traces.map((trace, traceIndex) => (
                      <TraceEntryComponent
                        key={traceIndex}
                        entry={trace.entry}
                        projectRoot={projectRoot}
                        depth={0}
                        programAddress={trace.programAddress}
                        isFirstInProgram={trace.isFirstInProgram}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
