"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const [txHash, setTxHash] = useState("")
  const [recentTransactions, setRecentTransactions] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((data) => setRecentTransactions(data.transactions || []))
      .catch(() => {})
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (txHash.trim()) {
      router.push(`/transaction/${txHash.trim()}`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <img src="/logo.svg" alt="Logo" className="h-16 w-auto" />
        </div>
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

        {recentTransactions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Found Transactions</span>
            </div>
            <div className="space-y-2">
              {recentTransactions.map((hash) => (
                <button
                  key={hash}
                  onClick={() => router.push(`/transaction/${hash}`)}
                  className="w-full text-left px-4 py-3 rounded-lg border border-border bg-card hover:bg-secondary transition-colors font-mono text-sm"
                >
                  {hash}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
