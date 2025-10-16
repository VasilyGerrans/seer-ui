import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export async function GET() {
  try {
    const projectRoot = process.env.PROJECT_ROOT || process.cwd()
    const seerDir = path.join(projectRoot, "seer")

    // Check if seer directory exists
    try {
      await fs.access(seerDir)
    } catch {
      return NextResponse.json({ transactions: [] })
    }

    const files = await fs.readdir(seerDir)

    // Extract unique transaction hashes and get file stats
    const txMap = new Map<string, number>()

    for (const file of files) {
      if (file.endsWith(".json")) {
        const parts = file.split("_")
        if (parts.length >= 4) {
          const txHash = parts[0]
          if (!txMap.has(txHash)) {
            // Get file creation time
            const filePath = path.join(seerDir, file)
            const stats = await fs.stat(filePath)
            txMap.set(txHash, stats.mtimeMs)
          }
        }
      }
    }

    // Sort by creation time (newest first)
    const transactions = Array.from(txMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([hash]) => hash)

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error("Error reading transactions:", error)
    return NextResponse.json({ transactions: [] })
  }
}
