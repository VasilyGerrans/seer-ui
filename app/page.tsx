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
      .catch((err) => console.error("Failed to load transactions:", err))
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
            <svg
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              version="1.1"
              viewBox="0 0 559.37 186.9"
              className="h-16 w-auto"
            >
              <defs>
                <style>{`
                  .st0 {
                    fill: url(#linear-gradient);
                  }
                  .st1 {
                    fill-rule: evenodd;
                  }
                  .st1, .st2 {
                    fill: #161133;
                  }
                `}</style>
                <linearGradient
                  id="linear-gradient"
                  x1="167.44"
                  y1="61.8"
                  x2="130.67"
                  y2="125.49"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#14ff92" />
                  <stop offset=".43" stopColor="#4f9bd5" />
                  <stop offset="1" stopColor="#94f" />
                </linearGradient>
              </defs>
              <path
                className="st0"
                d="M181.65,76.64h-65.19c6.14-11.74,18.43-19.76,32.6-19.76s26.46,8.02,32.6,19.76ZM149.06,130.41c14.24,0,26.58-8.1,32.69-19.94h-65.38c6.11,11.84,18.45,19.94,32.69,19.94ZM168.32,83.95h-54.73c-2.37,13.7,9.19,19.2,16.21,19.2h54.79c1.93-12.74-9.22-19.2-16.26-19.2Z"
              />
              <path
                className="st2"
                d="M148.7,144.81h-.13c-23.3-.03-46.54-8.32-67.19-23.96-15.54-11.77-24.11-23.44-24.47-23.93-1.08-1.49-1.1-3.5-.04-5,.36-.51,8.94-12.6,24.41-24.79,20.6-16.23,43.68-24.81,66.75-24.81s46.98,8.58,67.73,24.8c15.6,12.2,24.16,24.3,24.52,24.81,1.05,1.5,1.04,3.51-.04,4.99-.36.49-8.94,12.2-24.48,23.99-20.63,15.64-43.81,23.91-67.06,23.91ZM65.84,94.33c3.26,3.92,10.47,11.92,20.95,19.82,13.31,10.04,34.84,22.02,61.79,22.05h.12c26.87,0,48.35-11.96,61.64-22,10.49-7.92,17.71-15.95,20.97-19.88-3.24-4.05-10.48-12.38-21.06-20.62-13.37-10.4-35.01-22.81-62.22-22.81s-47.97,12.4-61.22,22.8c-10.5,8.24-17.73,16.57-20.97,20.63ZM60.39,94.38h0,0Z"
              />
              <path
                className="st1"
                d="M305.83,62.3v14.3h-31.86c-1.4,0-3.27.2-4.28,1.29-.92.98-1.26,2.21-1.26,3.55,0,.64.08,1.29.28,1.93.17.53.48.98.9,1.4.48.5,1.18.81,1.82,1.06,1.09.36,2.43.45,3.58.45h13.6c3.5,0,7.25.36,10.52,1.65,2.52,1.01,4.9,2.43,6.74,4.45,1.59,1.85,2.71,3.92,3.36,6.27-.59-2.13-.9-4.34-.9-6.58,0-2.46.34-4.95,1.09-7.3.76-2.32,1.99-4.36,3.69-6.1,1.79-1.84,4-3.13,6.41-4,2.85-1.03,5.96-1.37,8.98-1.37h31.53Z"
              />
              <path
                className="st1"
                d="M330.64,99.09h39.78v-13.76h-54.08v17.15c0,2.94.39,5.88,1.29,8.67.84,2.71,2.24,5.12,4.22,7.13,2.07,2.16,4.64,3.66,7.44,4.7,3.36,1.23,7.02,1.62,10.57,1.62h30.89v-14.3h-30.19c-1.68,0-3.53-.11-5.12-.67-1.06-.34-2.13-.84-2.94-1.62-.64-.64-1.12-1.37-1.4-2.24-.34-1.06-.48-2.13-.48-3.22v-3.47ZM370.76,76.6v-14.3h-30.89c-3.55,0-7.22.39-10.57,1.65-2.8,1.01-5.37,2.52-7.44,4.67-1.99,2.04-3.39,4.45-4.22,7.13-.11.28-.2.56-.25.84h53.38Z"
              />
              <path
                className="st1"
                d="M392.45,99.09h39.78v-13.76h-54.08v17.15c0,2.94.39,5.88,1.29,8.67.84,2.71,2.24,5.12,4.22,7.13,2.07,2.16,4.64,3.66,7.44,4.7,3.36,1.23,7.02,1.62,10.57,1.62h30.89v-14.3h-30.19c-1.68,0-3.53-.11-5.12-.67-1.06-.34-2.13-.84-2.94-1.62-.64-.64-1.12-1.37-1.4-2.24-.34-1.06-.48-2.13-.48-3.22v-3.47ZM432.57,76.6v-14.3h-30.89c-3.55,0-7.22.39-10.57,1.65-2.8,1.01-5.37,2.52-7.44,4.67-1.99,2.04-3.39,4.45-4.22,7.13-.11.28-.2.56-.25.84h53.38Z"
              />
              <path
                className="st1"
                d="M482.97,100.4l14.1,24.2h-16.06l-13.26-22.49h-13.43v22.49h-14.27v-25.07c0-2.99.53-6.32,2.74-8.53,2.21-2.18,5.46-2.74,8.45-2.74h22.66c.98,0,1.99-.14,2.88-.53.67-.28,1.29-.7,1.76-1.26.48-.56.81-1.17,1.04-1.87.25-.78.36-1.57.36-2.41,0-1.54-.45-2.85-1.45-4.06-1.09-1.29-2.99-1.54-4.59-1.54h-33.94v-14.3h33.6c3.11,0,6.29.39,9.2,1.57,2.46.98,4.7,2.38,6.55,4.28,1.73,1.82,3.02,3.95,3.83,6.32.78,2.35,1.17,4.81,1.17,7.3,0,2.01-.25,4.03-.76,5.99-.5,1.99-1.31,3.89-2.41,5.65-1.12,1.85-2.57,3.41-4.28,4.73-1.2.92-2.52,1.68-3.92,2.27h0Z"
              />
            </svg>
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
              <span>Recent Transactions</span>
            </div>
            <div className="space-y-2">
              {recentTransactions.map((hash) => (
                <button
                  key={hash}
                  onClick={() => router.push(`/transaction/${hash}`)}
                  className="w-full text-left px-4 py-3 rounded-lg border border-border bg-secondary hover:bg-accent transition-colors font-mono text-sm"
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
