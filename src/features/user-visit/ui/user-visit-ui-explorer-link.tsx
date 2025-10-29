'use client'

import { Button } from '@/components/ui/button'
import { ExternalLink, Info } from 'lucide-react'
import { useSolana } from '@/components/solana/use-solana'
import { useCounterQuery } from '../data-access/use-counter-query'
import { useEffect, useState } from 'react'

export function UserVisitUiExplorerLink() {
  const { cluster } = useSolana()
  const { data: counter } = useCounterQuery()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Map cluster IDs to explorer cluster names
  const getExplorerCluster = (clusterId: string) => {
    if (clusterId.includes('devnet')) return 'devnet'
    if (clusterId.includes('localnet')) return 'localnet'
    if (clusterId.includes('mainnet')) return 'mainnet-beta'
    return 'devnet' // default
  }

  // Use counter account address if available, otherwise general explorer
  const clusterName = getExplorerCluster(cluster.id)
  const explorerUrl = counter?.address
    ? `https://explorer.solana.com/address/${counter.address}?cluster=${clusterName}`
    : `https://explorer.solana.com/?cluster=${clusterName}`

  const buttonText = counter?.address ? 'View Counter on Explorer' : 'View on Solana Explorer'

  // Only render on client to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <a
            href="https://explorer.solana.com/?cluster=devnet"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            View on Solana Explorer
          </a>
        </Button>
        <span title="View the counter account on Solana Explorer to verify the visit count and transaction history">
          <Info className="w-4 h-4 text-muted-foreground cursor-help" />
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" asChild>
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          {buttonText}
        </a>
      </Button>
      <span title="View the counter account on Solana Explorer to verify the visit count and transaction history">
        <Info className="w-4 h-4 text-muted-foreground cursor-help" />
      </span>
    </div>
  )
}