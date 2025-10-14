"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const [txHash, setTxHash] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (txHash.trim()) {
      router.push(`/transaction/${txHash.trim()}`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold tracking-tight">Seer</h2>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Enter transaction hash..."
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              className="pl-12 h-14 text-base font-mono bg-secondary border-border"
            />
          </div>
          <Button type="submit" size="lg" className="w-full h-12 text-base font-medium" disabled={!txHash.trim()}>
            Search Transaction
          </Button>
        </form>
      </div>
    </div>
  )
}
