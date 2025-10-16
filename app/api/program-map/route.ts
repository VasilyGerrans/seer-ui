import { type NextRequest, NextResponse } from "next/server"
import { loadProgramMap } from "@/lib/load-program-map"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const projectRoot = searchParams.get("projectRoot")

    if (!projectRoot) {
      return NextResponse.json({ error: "Project root is required" }, { status: 400 })
    }

    const map = await loadProgramMap(projectRoot)
    return NextResponse.json({ map })
  } catch (error) {
    console.error("Error loading program map:", error)
    return NextResponse.json({ map: {} })
  }
}
