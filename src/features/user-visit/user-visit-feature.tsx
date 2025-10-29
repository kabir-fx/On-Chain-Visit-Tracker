'use client'

import { useSolana } from '@/components/solana/use-solana'
import { WalletDropdown } from '@/components/wallet-dropdown'
import { AppHero } from '@/components/app-hero'
import { UserVisitUiCounter } from './ui/user-visit-ui-counter'
import { UserVisitUiExplorerLink } from './ui/user-visit-ui-explorer-link'
import { useUserVisitMutation } from './data-access/use-user-visit-mutation'
import { useUserVisitQuery } from './data-access/use-user-visit-query'
import { UiWalletAccount } from '@wallet-ui/react'
import { useState } from 'react'
import React from 'react'

function UserVisitFeatureContent({ account }: { account: UiWalletAccount }) {
  const recordVisit = useUserVisitMutation(account)
  const { data: userVisit } = useUserVisitQuery(account)
  const [isConfirming, setIsConfirming] = useState(false)

  const hasVisited = userVisit?.hasVisited ?? false

  const handleRecordVisit = () => {
    recordVisit.mutate()
  }

  // Update confirmation state based on mutation status
  React.useEffect(() => {
    if (recordVisit.isSuccess && !recordVisit.isPending) {
      setIsConfirming(true)
    } else if (!recordVisit.isPending) {
      setIsConfirming(false)
    }
  }, [recordVisit.isSuccess, recordVisit.isPending])

  return (
    <div className="max-w-md mx-auto">
      <UserVisitUiCounter
        onRecordVisit={handleRecordVisit}
        isRecording={recordVisit.isPending || isConfirming}
        hasVisited={hasVisited}
        isConfirming={isConfirming}
      />
    </div>
  )
}

export default function UserVisitFeature() {
  const { account } = useSolana()

  return (
    <div className="container mx-auto px-4 py-8">
      <AppHero
        title="On-Chain Visit Tracker"
        subtitle={
          account
            ? "Record your website visit and contribute to our community metrics. Each wallet can only visit once."
            : 'Connect your wallet to record your website visit.'
        }
      >
        <div className="flex justify-center mb-6">
          <UserVisitUiExplorerLink />
        </div>
        {account ? (
          <UserVisitFeatureContent account={account} />
        ) : (
          <div className="flex justify-center">
            <WalletDropdown />
          </div>
        )}
      </AppHero>
    </div>
  )
}