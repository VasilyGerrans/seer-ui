import { type NextRequest, NextResponse } from "next/server"
import { readdir, readFile } from "fs/promises"
import { join } from "path"
import type { TransactionFile, TraceEntry } from "@/lib/types"

export async function GET(request: NextRequest, { params }: { params: Promise<{ hash: string }> }) {
  try {
    const { hash } = await params
    const projectRoot = process.env.PROJECT_ROOT || process.cwd()
    const seerPath = join(projectRoot, "seer")

    // Read all files in the seer directory
    let files: string[]
    try {
      files = await readdir(seerPath)
    } catch (error) {
      console.log("[v0] Seer directory not found:", error)
      return NextResponse.json({ files: [] })
    }

    // Filter files that start with the transaction hash
    const matchingFiles = files.filter((file) => file.startsWith(hash) && file.endsWith(".json"))

    if (matchingFiles.length === 0) {
      return NextResponse.json({ files: [] })
    }

    // Parse each matching file
    const transactionFiles: TransactionFile[] = []

    for (const filename of matchingFiles) {
      // Parse filename: {txHash}_{instruction}_{program}_{order}.json
      const parts = filename.replace(".json", "").split("_")
      if (parts.length < 4) continue

      const txHash = parts[0]
      const instructionNumber = Number.parseInt(parts[1], 10)
      const executionOrder = Number.parseInt(parts[parts.length - 1], 10)
      // Program address is everything between instruction and order
      const programAddress = parts.slice(2, -1).join("_")

      // Read and parse the JSON file
      const filePath = join(seerPath, filename)
      const fileContent = await readFile(filePath, "utf-8")
      const traces: TraceEntry[] = JSON.parse(fileContent)

      transactionFiles.push({
        filename,
        txHash,
        instructionNumber,
        programAddress,
        executionOrder,
        traces,
      })
    }

    // Sort by execution order
    transactionFiles.sort((a, b) => a.executionOrder - b.executionOrder)

    return NextResponse.json({ files: transactionFiles, projectRoot })
  } catch (error) {
    console.error("[v0] Error reading transaction files:", error)
    return NextResponse.json({ error: "Failed to read transaction files" }, { status: 500 })
  }
}
