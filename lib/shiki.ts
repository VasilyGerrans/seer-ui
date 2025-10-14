import { createHighlighter } from "shiki"

let highlighterInstance: Awaited<ReturnType<typeof createHighlighter>> | null = null

export async function getHighlighter() {
  if (!highlighterInstance) {
    highlighterInstance = await createHighlighter({
      themes: ["github-light"],
      langs: ["rust", "typescript", "javascript", "python", "json", "toml", "yaml", "bash", "c", "cpp"],
    })
  }
  return highlighterInstance
}

export function getLanguageFromExtension(extension: string): string {
  const languageMap: Record<string, string> = {
    rs: "rust",
    ts: "typescript",
    tsx: "typescript",
    js: "javascript",
    jsx: "javascript",
    py: "python",
    json: "json",
    toml: "toml",
    yaml: "yaml",
    yml: "yaml",
    sh: "bash",
    c: "c",
    cpp: "cpp",
    cc: "cpp",
    h: "c",
    hpp: "cpp",
  }
  return languageMap[extension] || "text"
}
