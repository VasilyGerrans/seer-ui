import { type NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { getHighlighter, getLanguageFromExtension } from "@/lib/shiki"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const filePath = searchParams.get("file")
    const lineNumber = Number.parseInt(searchParams.get("line") || "0", 10)

    if (!filePath) {
      return NextResponse.json({ error: "File path is required" }, { status: 400 })
    }

    // Read the file
    const fileContent = await readFile(filePath, "utf-8")
    const lines = fileContent.split("\n")

    // Calculate the range: 5 lines before, the target line, 5 lines after (11 total)
    const startLine = Math.max(0, lineNumber - 6) // lineNumber is 1-based, array is 0-based
    const endLine = Math.min(lines.length, lineNumber + 5)

    const codeLines = lines.slice(startLine, endLine)
    const code = codeLines.join("\n")

    // Determine file extension for syntax highlighting
    const extension = filePath.split(".").pop() || "txt"
    const language = getLanguageFromExtension(extension)

    const highlighter = await getHighlighter()
    const html = highlighter.codeToHtml(code, {
      lang: language,
      theme: "one-light",
    })

    return NextResponse.json({
      html,
      startLine: startLine + 1, // Convert back to 1-based
      targetLine: lineNumber,
      extension,
      language,
      totalLines: lines.length,
    })
  } catch (error) {
    console.error("[v0] Error reading code file:", error)
    return NextResponse.json({ error: "Failed to read code file" }, { status: 500 })
  }
}
