export interface TraceEntry {
  instruction: number
  step: {
    file: string
    line: number
    function: string | null
    call: boolean
  }
  children?: TraceEntry[]
}

export interface TransactionFile {
  filename: string
  txHash: string
  instructionNumber: number
  programAddress: string
  executionOrder: number
  traces: TraceEntry[]
}
